package es.upm.dit.apsv.serverresumen.user;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository){
        this.userRepository=userRepository;
    }

    /** 
     * Obtención de un listado de todos los usuarios del repositorio.
     * útil para desarrolladores.
     * @return List<User>
     */
    public List<User> getUsers(){
        return userRepository.findAll();
    }
    
    /** 
     * Guardado de un nuevo usuario en el repositorio.
     * @param user El objeto usuario a almacenar.
     * @return ResponseEntity<User>
     * @throws URISyntaxException
     */
    public ResponseEntity<User> addUser(User user) throws URISyntaxException{
        User result = userRepository.save(user);
        return ResponseEntity.created(new URI("/resumen/" + result.getId())).body(result);
    }
   
    /** 
     * Actualizar el nombre de un usuario en el repositorio.
     * @param name El nuevo nombre.
     * @param user_id El identificador del usuario a actualizar.
     * @return Optional<User>
     * @throws Exception
     */
    //put nombre
    public Optional<User> updateName(String name, Long user_id) throws Exception{
        userRepository.updateName(name, user_id);
        return userRepository.findById(user_id);
    }

    /** 
     * Actualizar el apellido de un usuario en el repositorio.
     * @param surname El nuevo apellido.
     * @param user_id El identificador del usuario a actualizar.
     * @return Optional<User>
     * @throws Exception
     */
    public Optional<User> updateSurname(String surname, Long user_id) throws Exception{
        userRepository.updateSurname(surname, user_id);
        return userRepository.findById(user_id);
    }
    
    /** 
     * Actualizar el plan al que pertenece un usuario en el repositorio.
     * @param user_id El identificador del usuario a actualizar.
     * @param premium True si pasa a plan premium y False si pasa a estandar.
     * @return Optional<User>
     * @throws Exception
     */
    public Optional<User> updateUserToPremium(Long user_id, Boolean premium) throws Exception{
        userRepository.updateUserToPremium(user_id, premium);
        return userRepository.findById(user_id);
    }

    /** 
     * Actualizar el valor del IBAN (cuenta bancaria) de un usuario en el repositorio.
     * @param user_id El identificador del usuario a actualizar.
     * @param iban El número de cuenta a establecer. Nulo si pasa a plan estandar.
     * @return Optional<User>
     * @throws Exception
     */
    public Optional<User> updateUserIban(Long user_id, String iban) throws Exception{
        userRepository.updateUserIban(user_id, iban);
        return userRepository.findById(user_id);
    }
}
