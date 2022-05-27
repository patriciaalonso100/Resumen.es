package es.upm.dit.apsv.serverresumen.user;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping(path = "/api")
public class UserController {
    
    private final UserService userService;
    @Autowired
    public UserController(UserService userService){
        this.userService=userService;
    }

    /** 
     * Llamar al servicio para obtener un listado de usuarios.
     * Útil para desarrolladores.
     * @return List<User>
     */
    @GetMapping("/usuario")
    public List<User> getUsers(){
        return userService.getUsers();
    }
 
    /** 
     * Llamada al servicio para actualizar el nombre de un usuario.
     * @param name El nuevo nombre.
     * @param user_id El identificador del usuario a actualizar.
     * @return Optional<User>
     * @throws Exception
     */
    @PutMapping("/usuario/nombre")
    public Optional<User> updateName(@RequestParam ("name") String name, @RequestParam ("user_id") Long user_id  ) throws Exception{
        return userService.updateName(name, user_id);
    }

    /** 
     * Llamada al servicio para actualizar el apellido de un usuario.
     * @param surname El nuevo apellido.
     * @param user_id El identificador del usuario a actualizar.
     * @return Optional<User>
     * @throws Exception
     */
    @PutMapping("/usuario/apellido")
    public Optional<User> updateSurname(@RequestParam ("surname") String surname, @RequestParam ("user_id") Long user_id  ) throws Exception{
        return userService.updateSurname(surname, user_id);
    }

    
    /** 
     * Llamada al servicio para cambiar el plan al que pertenece el usuario.
     * @param user_id El identificador del usuario a actualizar.
     * @param premium True si es plan premium y False si es estandar.
     * @return Optional<User>
     * @throws Exception
     */
    @PutMapping("/usuario/premium")
    public Optional<User> updateUserToPremium(@RequestParam ("user_id") Long user_id, @RequestParam ("premium") Boolean premium) throws Exception{
        return userService.updateUserToPremium(user_id, premium);
    }
    
    /** 
     * Llamada al servicio para modificar el IBAN de un usuario al cambiar de plan.
     * @param user_id El identificador del usuario a actualizar.
     * @param iban El núumero de cuenta del usuario. Será nulo si pasa al plan estandar.
     * @return Optional<User>
     * @throws Exception
     */ 
    @PutMapping("/usuario/iban")
    public Optional<User> updateUserIban(@RequestParam ("user_id") Long user_id, @RequestParam ("iban") String iban) throws Exception{
        return userService.updateUserIban(user_id, iban);
    }
}
