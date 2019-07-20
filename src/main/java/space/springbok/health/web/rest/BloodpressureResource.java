package space.springbok.health.web.rest;

import space.springbok.health.domain.Bloodpressure;
import space.springbok.health.repository.BloodpressureRepository;
import space.springbok.health.repository.search.BloodpressureSearchRepository;
import space.springbok.health.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link space.springbok.health.domain.Bloodpressure}.
 */
@RestController
@RequestMapping("/api")
public class BloodpressureResource {

    private final Logger log = LoggerFactory.getLogger(BloodpressureResource.class);

    private static final String ENTITY_NAME = "bloodpressure";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BloodpressureRepository bloodpressureRepository;

    private final BloodpressureSearchRepository bloodpressureSearchRepository;

    public BloodpressureResource(BloodpressureRepository bloodpressureRepository, BloodpressureSearchRepository bloodpressureSearchRepository) {
        this.bloodpressureRepository = bloodpressureRepository;
        this.bloodpressureSearchRepository = bloodpressureSearchRepository;
    }

    /**
     * {@code POST  /bloodpressures} : Create a new bloodpressure.
     *
     * @param bloodpressure the bloodpressure to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bloodpressure, or with status {@code 400 (Bad Request)} if the bloodpressure has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/bloodpressures")
    public ResponseEntity<Bloodpressure> createBloodpressure(@RequestBody Bloodpressure bloodpressure) throws URISyntaxException {
        log.debug("REST request to save Bloodpressure : {}", bloodpressure);
        if (bloodpressure.getId() != null) {
            throw new BadRequestAlertException("A new bloodpressure cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Bloodpressure result = bloodpressureRepository.save(bloodpressure);
        bloodpressureSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/bloodpressures/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bloodpressures} : Updates an existing bloodpressure.
     *
     * @param bloodpressure the bloodpressure to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bloodpressure,
     * or with status {@code 400 (Bad Request)} if the bloodpressure is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bloodpressure couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bloodpressures")
    public ResponseEntity<Bloodpressure> updateBloodpressure(@RequestBody Bloodpressure bloodpressure) throws URISyntaxException {
        log.debug("REST request to update Bloodpressure : {}", bloodpressure);
        if (bloodpressure.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Bloodpressure result = bloodpressureRepository.save(bloodpressure);
        bloodpressureSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bloodpressure.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /bloodpressures} : get all the bloodpressures.
     *
     * @param pageable the pagination information.
     * @param queryParams a {@link MultiValueMap} query parameters.
     * @param uriBuilder a {@link UriComponentsBuilder} URI builder.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bloodpressures in body.
     */
    @GetMapping("/bloodpressures")
    public ResponseEntity<List<Bloodpressure>> getAllBloodpressures(Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder) {
        log.debug("REST request to get a page of Bloodpressures");
        Page<Bloodpressure> page = bloodpressureRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /bloodpressures/:id} : get the "id" bloodpressure.
     *
     * @param id the id of the bloodpressure to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bloodpressure, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bloodpressures/{id}")
    public ResponseEntity<Bloodpressure> getBloodpressure(@PathVariable Long id) {
        log.debug("REST request to get Bloodpressure : {}", id);
        Optional<Bloodpressure> bloodpressure = bloodpressureRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bloodpressure);
    }

    /**
     * {@code DELETE  /bloodpressures/:id} : delete the "id" bloodpressure.
     *
     * @param id the id of the bloodpressure to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bloodpressures/{id}")
    public ResponseEntity<Void> deleteBloodpressure(@PathVariable Long id) {
        log.debug("REST request to delete Bloodpressure : {}", id);
        bloodpressureRepository.deleteById(id);
        bloodpressureSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/bloodpressures?query=:query} : search for the bloodpressure corresponding
     * to the query.
     *
     * @param query the query of the bloodpressure search.
     * @param pageable the pagination information.
     * @param queryParams a {@link MultiValueMap} query parameters.
     * @param uriBuilder a {@link UriComponentsBuilder} URI builder.
     * @return the result of the search.
     */
    @GetMapping("/_search/bloodpressures")
    public ResponseEntity<List<Bloodpressure>> searchBloodpressures(@RequestParam String query, Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder) {
        log.debug("REST request to search for a page of Bloodpressures for query {}", query);
        Page<Bloodpressure> page = bloodpressureSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}
