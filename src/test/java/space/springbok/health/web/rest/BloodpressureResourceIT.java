package space.springbok.health.web.rest;

import space.springbok.health.TwentyOnePointsApp;
import space.springbok.health.domain.Bloodpressure;
import space.springbok.health.repository.BloodpressureRepository;
import space.springbok.health.repository.search.BloodpressureSearchRepository;
import space.springbok.health.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;

import static space.springbok.health.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link BloodpressureResource} REST controller.
 */
@SpringBootTest(classes = TwentyOnePointsApp.class)
public class BloodpressureResourceIT {

    private static final LocalDate DEFAULT_TIMESTAMP = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_TIMESTAMP = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_SYSTOLIC = 1;
    private static final Integer UPDATED_SYSTOLIC = 2;

    private static final Integer DEFAULT_DIASTOLIC = 1;
    private static final Integer UPDATED_DIASTOLIC = 2;

    @Autowired
    private BloodpressureRepository bloodpressureRepository;

    /**
     * This repository is mocked in the space.springbok.health.repository.search test package.
     *
     * @see space.springbok.health.repository.search.BloodpressureSearchRepositoryMockConfiguration
     */
    @Autowired
    private BloodpressureSearchRepository mockBloodpressureSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restBloodpressureMockMvc;

    private Bloodpressure bloodpressure;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final BloodpressureResource bloodpressureResource = new BloodpressureResource(bloodpressureRepository, mockBloodpressureSearchRepository);
        this.restBloodpressureMockMvc = MockMvcBuilders.standaloneSetup(bloodpressureResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bloodpressure createEntity(EntityManager em) {
        Bloodpressure bloodpressure = new Bloodpressure()
            .timestamp(DEFAULT_TIMESTAMP)
            .systolic(DEFAULT_SYSTOLIC)
            .diastolic(DEFAULT_DIASTOLIC);
        return bloodpressure;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bloodpressure createUpdatedEntity(EntityManager em) {
        Bloodpressure bloodpressure = new Bloodpressure()
            .timestamp(UPDATED_TIMESTAMP)
            .systolic(UPDATED_SYSTOLIC)
            .diastolic(UPDATED_DIASTOLIC);
        return bloodpressure;
    }

    @BeforeEach
    public void initTest() {
        bloodpressure = createEntity(em);
    }

    @Test
    @Transactional
    public void createBloodpressure() throws Exception {
        int databaseSizeBeforeCreate = bloodpressureRepository.findAll().size();

        // Create the Bloodpressure
        restBloodpressureMockMvc.perform(post("/api/bloodpressures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bloodpressure)))
            .andExpect(status().isCreated());

        // Validate the Bloodpressure in the database
        List<Bloodpressure> bloodpressureList = bloodpressureRepository.findAll();
        assertThat(bloodpressureList).hasSize(databaseSizeBeforeCreate + 1);
        Bloodpressure testBloodpressure = bloodpressureList.get(bloodpressureList.size() - 1);
        assertThat(testBloodpressure.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
        assertThat(testBloodpressure.getSystolic()).isEqualTo(DEFAULT_SYSTOLIC);
        assertThat(testBloodpressure.getDiastolic()).isEqualTo(DEFAULT_DIASTOLIC);

        // Validate the Bloodpressure in Elasticsearch
        verify(mockBloodpressureSearchRepository, times(1)).save(testBloodpressure);
    }

    @Test
    @Transactional
    public void createBloodpressureWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = bloodpressureRepository.findAll().size();

        // Create the Bloodpressure with an existing ID
        bloodpressure.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBloodpressureMockMvc.perform(post("/api/bloodpressures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bloodpressure)))
            .andExpect(status().isBadRequest());

        // Validate the Bloodpressure in the database
        List<Bloodpressure> bloodpressureList = bloodpressureRepository.findAll();
        assertThat(bloodpressureList).hasSize(databaseSizeBeforeCreate);

        // Validate the Bloodpressure in Elasticsearch
        verify(mockBloodpressureSearchRepository, times(0)).save(bloodpressure);
    }


    @Test
    @Transactional
    public void getAllBloodpressures() throws Exception {
        // Initialize the database
        bloodpressureRepository.saveAndFlush(bloodpressure);

        // Get all the bloodpressureList
        restBloodpressureMockMvc.perform(get("/api/bloodpressures?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bloodpressure.getId().intValue())))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(DEFAULT_TIMESTAMP.toString())))
            .andExpect(jsonPath("$.[*].systolic").value(hasItem(DEFAULT_SYSTOLIC)))
            .andExpect(jsonPath("$.[*].diastolic").value(hasItem(DEFAULT_DIASTOLIC)));
    }
    
    @Test
    @Transactional
    public void getBloodpressure() throws Exception {
        // Initialize the database
        bloodpressureRepository.saveAndFlush(bloodpressure);

        // Get the bloodpressure
        restBloodpressureMockMvc.perform(get("/api/bloodpressures/{id}", bloodpressure.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(bloodpressure.getId().intValue()))
            .andExpect(jsonPath("$.timestamp").value(DEFAULT_TIMESTAMP.toString()))
            .andExpect(jsonPath("$.systolic").value(DEFAULT_SYSTOLIC))
            .andExpect(jsonPath("$.diastolic").value(DEFAULT_DIASTOLIC));
    }

    @Test
    @Transactional
    public void getNonExistingBloodpressure() throws Exception {
        // Get the bloodpressure
        restBloodpressureMockMvc.perform(get("/api/bloodpressures/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBloodpressure() throws Exception {
        // Initialize the database
        bloodpressureRepository.saveAndFlush(bloodpressure);

        int databaseSizeBeforeUpdate = bloodpressureRepository.findAll().size();

        // Update the bloodpressure
        Bloodpressure updatedBloodpressure = bloodpressureRepository.findById(bloodpressure.getId()).get();
        // Disconnect from session so that the updates on updatedBloodpressure are not directly saved in db
        em.detach(updatedBloodpressure);
        updatedBloodpressure
            .timestamp(UPDATED_TIMESTAMP)
            .systolic(UPDATED_SYSTOLIC)
            .diastolic(UPDATED_DIASTOLIC);

        restBloodpressureMockMvc.perform(put("/api/bloodpressures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedBloodpressure)))
            .andExpect(status().isOk());

        // Validate the Bloodpressure in the database
        List<Bloodpressure> bloodpressureList = bloodpressureRepository.findAll();
        assertThat(bloodpressureList).hasSize(databaseSizeBeforeUpdate);
        Bloodpressure testBloodpressure = bloodpressureList.get(bloodpressureList.size() - 1);
        assertThat(testBloodpressure.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
        assertThat(testBloodpressure.getSystolic()).isEqualTo(UPDATED_SYSTOLIC);
        assertThat(testBloodpressure.getDiastolic()).isEqualTo(UPDATED_DIASTOLIC);

        // Validate the Bloodpressure in Elasticsearch
        verify(mockBloodpressureSearchRepository, times(1)).save(testBloodpressure);
    }

    @Test
    @Transactional
    public void updateNonExistingBloodpressure() throws Exception {
        int databaseSizeBeforeUpdate = bloodpressureRepository.findAll().size();

        // Create the Bloodpressure

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBloodpressureMockMvc.perform(put("/api/bloodpressures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bloodpressure)))
            .andExpect(status().isBadRequest());

        // Validate the Bloodpressure in the database
        List<Bloodpressure> bloodpressureList = bloodpressureRepository.findAll();
        assertThat(bloodpressureList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Bloodpressure in Elasticsearch
        verify(mockBloodpressureSearchRepository, times(0)).save(bloodpressure);
    }

    @Test
    @Transactional
    public void deleteBloodpressure() throws Exception {
        // Initialize the database
        bloodpressureRepository.saveAndFlush(bloodpressure);

        int databaseSizeBeforeDelete = bloodpressureRepository.findAll().size();

        // Delete the bloodpressure
        restBloodpressureMockMvc.perform(delete("/api/bloodpressures/{id}", bloodpressure.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Bloodpressure> bloodpressureList = bloodpressureRepository.findAll();
        assertThat(bloodpressureList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Bloodpressure in Elasticsearch
        verify(mockBloodpressureSearchRepository, times(1)).deleteById(bloodpressure.getId());
    }

    @Test
    @Transactional
    public void searchBloodpressure() throws Exception {
        // Initialize the database
        bloodpressureRepository.saveAndFlush(bloodpressure);
        when(mockBloodpressureSearchRepository.search(queryStringQuery("id:" + bloodpressure.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(bloodpressure), PageRequest.of(0, 1), 1));
        // Search the bloodpressure
        restBloodpressureMockMvc.perform(get("/api/_search/bloodpressures?query=id:" + bloodpressure.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bloodpressure.getId().intValue())))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(DEFAULT_TIMESTAMP.toString())))
            .andExpect(jsonPath("$.[*].systolic").value(hasItem(DEFAULT_SYSTOLIC)))
            .andExpect(jsonPath("$.[*].diastolic").value(hasItem(DEFAULT_DIASTOLIC)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Bloodpressure.class);
        Bloodpressure bloodpressure1 = new Bloodpressure();
        bloodpressure1.setId(1L);
        Bloodpressure bloodpressure2 = new Bloodpressure();
        bloodpressure2.setId(bloodpressure1.getId());
        assertThat(bloodpressure1).isEqualTo(bloodpressure2);
        bloodpressure2.setId(2L);
        assertThat(bloodpressure1).isNotEqualTo(bloodpressure2);
        bloodpressure1.setId(null);
        assertThat(bloodpressure1).isNotEqualTo(bloodpressure2);
    }
}
