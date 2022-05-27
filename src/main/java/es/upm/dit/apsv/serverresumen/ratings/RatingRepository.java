package es.upm.dit.apsv.serverresumen.ratings;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface RatingRepository extends JpaRepository<Rating,Long> {
    /**
     * Obtener la lista de valoraciones de un resumen concreto con la finalidad de computar
     * su valoración media proveniente de la base de datos.
     * @param resume_id El resumen del que se quiere obtener dicha valoración media.
     * @return
     */
    @Query(value="SELECT * FROM rating r WHERE r.resume=?1", nativeQuery=true)
    List<Rating> findRatingsByResume(Long resume_id);

    /**
     * Obtener la valoración desde la base de datos, dada por un usuario 
     * concreto para un resumen concreto.
     * @param resume_id El resumen del que se quiere obtener la valoración.
     * @param user_id El usuario que hizo esa valoración.
     * @return
     */
    @Query(value="SELECT * FROM `rating` r WHERE r.resume=?1 AND r.user=?2", nativeQuery=true)
    Rating findByUserandResume(Long resume_id, Long user_id);

    /**
     * Actualizar en la base de datos la valoración de un resumen que 
     * ya tenía por parte de ese usuario.
     * @param resume_id El resumen del que queremos actualizar la valoración.
     * @param user_id El usuario que realizó esa valoración inicialmente y ahora quiere actualizarla.
     * @param rating La nueva valoración que quiere darle.
     */
    @Modifying
    @Transactional
    @Query(value="UPDATE rating r SET r.rating=?3 WHERE r.resume=?1 AND r.user=?2",nativeQuery=true)
    void updateRating(Long resume_id, Long user_id, double rating);

}
