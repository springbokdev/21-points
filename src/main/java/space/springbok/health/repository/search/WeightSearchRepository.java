package space.springbok.health.repository.search;

import space.springbok.health.domain.Weight;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Weight} entity.
 */
public interface WeightSearchRepository extends ElasticsearchRepository<Weight, Long> {
}
