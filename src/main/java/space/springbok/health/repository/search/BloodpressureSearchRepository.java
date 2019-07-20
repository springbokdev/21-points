package space.springbok.health.repository.search;

import space.springbok.health.domain.Bloodpressure;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Bloodpressure} entity.
 */
public interface BloodpressureSearchRepository extends ElasticsearchRepository<Bloodpressure, Long> {
}
