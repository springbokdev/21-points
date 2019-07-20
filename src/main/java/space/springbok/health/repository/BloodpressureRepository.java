package space.springbok.health.repository;

import space.springbok.health.domain.Bloodpressure;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Bloodpressure entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BloodpressureRepository extends JpaRepository<Bloodpressure, Long> {

    @Query("select bloodpressure from Bloodpressure bloodpressure where bloodpressure.user.login = ?#{principal.username}")
    List<Bloodpressure> findByUserIsCurrentUser();

}
