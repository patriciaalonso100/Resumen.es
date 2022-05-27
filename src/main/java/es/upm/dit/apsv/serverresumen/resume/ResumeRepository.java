package es.upm.dit.apsv.serverresumen.resume;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


@Repository
public interface ResumeRepository extends JpaRepository<Resume,Long>{
    
    /**
     * Actualizar en la base de datos un resumen concreto a premium.
     * @param resume_id El resumen a actualizar.
     */
    @Modifying
    @Transactional
    @Query(value="UPDATE resume r SET is_premium=true WHERE r.resumeid=?1",nativeQuery=true)
    void updateResumeToPremium(Long resume_id);

    /**
     * Actualizar en la base de datos un resumen a verificado.
     * @param resume_id El resumen a actualizar.
     */
    @Modifying
    @Transactional
    @Query(value="UPDATE resume r SET is_verified=true WHERE r.resumeid=?1",nativeQuery=true)
    void updateResumeToVerified(Long resume_id);

    /**
     * Obtener de la base de datos el listado de resúmenes no verificados.
     * @return
     */
    @Query(value="SELECT * FROM resume r WHERE r.is_verified=false", nativeQuery=true)
    List<Resume> findResumeNotVerified();

    /**
     * Obtener de la base de datos el listado de resúmenes verificados.
     * @return
     */
    @Query(value="SELECT * FROM resume r WHERE r.is_verified=true", nativeQuery=true)
    List<Resume> findResumeVerified();

    /**
     * Obtener de la base de datos el listado de resúmenes de un usuario concreto.
     * @param user_id El identificador del usuario que quiere sus resúmenes.
     * @return
     */
    @Query(value="SELECT * FROM resume r WHERE r.user=?1", nativeQuery=true)
    List<Resume> findResumeByUser(Long user_id);
}
