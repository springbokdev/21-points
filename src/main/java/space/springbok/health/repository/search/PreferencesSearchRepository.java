package space.springbok.health.repository.search;

import space.springbok.health.domain.Preferences;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Preferences} entity.
 */
public interface PreferencesSearchRepository extends ElasticsearchRepository<Preferences, Long> {
}
