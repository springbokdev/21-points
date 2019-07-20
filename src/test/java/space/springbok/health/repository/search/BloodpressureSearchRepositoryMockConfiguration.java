package space.springbok.health.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link BloodpressureSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class BloodpressureSearchRepositoryMockConfiguration {

    @MockBean
    private BloodpressureSearchRepository mockBloodpressureSearchRepository;

}
