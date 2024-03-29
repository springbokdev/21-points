package space.springbok.health.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link WeightSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class WeightSearchRepositoryMockConfiguration {

    @MockBean
    private WeightSearchRepository mockWeightSearchRepository;

}
