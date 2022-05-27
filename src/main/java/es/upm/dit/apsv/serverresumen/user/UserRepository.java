package es.upm.dit.apsv.serverresumen.user;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    
    /**
     * Localizar un usuario según su dirección de correo electrónico
     * en la base de datos.
     * @param email El correo electrónico a buscar.
     * @return
     */
    @Query(value="SELECT * FROM user u WHERE u.email=?1",nativeQuery=true)
    User findUserByEmail(String email);

    /**
     * Actualizar el nombre de un usuario en la base de datos.
     * @param name El nuevo nombre.
     * @param user_id El identificador de usuario que actualizar.
     */
    @Modifying
    @Transactional
    @Query(value="UPDATE user u SET name=?1 WHERE u.id=?2",nativeQuery=true)
    void updateName(String name, Long user_id);

    /**
     * Actualizar el apellido de un usuario en la base de datos.
     * @param surname El nuevo apellido.
     * @param user_id El identificador de usuario que actualizar.
     */
    @Modifying
    @Transactional
    @Query(value="UPDATE user u SET surname=?1 WHERE u.id=?2",nativeQuery=true)
    void updateSurname(String surname, Long user_id);

    /**
     * Actualizar el plan al que pertenece un usuario en la base de datos.
     * @param user_id El identificador de usuario que actualizar.
     * @param premium True si pasa a plan premium y False a estandar.
     */
    @Modifying
    @Transactional
    @Query(value="UPDATE user u SET u.premium=?2 WHERE u.id=?1",nativeQuery=true)
    void updateUserToPremium(Long user_id, boolean premium);

    /**
     * Actualizar el valor del IBAN (número de cuenta bancaria) de un usuario en
     * la base de datos.
     * @param user_id El identificador de usuario que actualizar.
     * @param iban El número de cuenta bancaria. Nulo si pasa a plan estandar.
     */
    @Modifying
    @Transactional
    @Query(value="UPDATE user u SET u.iban=?2 WHERE u.id=?1",nativeQuery=true)
    void updateUserIban(Long user_id, String iban);


}
