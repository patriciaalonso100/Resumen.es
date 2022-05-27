package es.upm.dit.apsv.serverresumen.user;

import javax.persistence.*;

@Entity
@Table(name = "User")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(
        name="id",
        updatable=false,
        unique = true,
        nullable=false
    )
    private Long id; 

    @Column(
        name="email",
        unique = true,
        nullable=false
    )
    private String email;

    @Column(
        name="name",
        nullable=false
    )
    private String name;

    @Column(
        name="surname",
        nullable=false
    )
    private String surname;

    @Column(
        name="premium",
        nullable = false
    )
    private boolean premium;

    @Column(
        name="expert",
        nullable = false
    )
    private boolean expert;

    @Column(
        name="accRetribution"
    )
    private double accRetribution;
    

    @Column(
        name="password",
        nullable=false
    )
    private String password;

    @Column(
        name="iban",
        unique=true
    )
    private String iban;
    
    public User(){}

    public User(Long id, String email, String name, String surname, boolean premium, boolean expert,
        double accRetribution, String password, String iban) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.premium = premium;
        this.expert = expert;
        this.accRetribution = accRetribution;
        this.password = password;
        this.iban = iban;
    }

    public User(String email, String name, String surname, boolean premium, boolean expert,
        double accRetribution, String iban, String password) {
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.premium = premium;
        this.expert = expert;
        this.accRetribution = accRetribution;
        this.iban = iban;
        this.password = password;
    }
    
    /** 
     * Obtener el identificador de usuario.
     * @return Long
     */
    public Long getId() {
        return id;
    }

    /** 
     * Establecer el identificador de usuario.
     * @param id El identificador a almacenar.
     */
    public void setId(Long id) {
        this.id = id;
    }
    
    /** 
     * Obtener el número de cuenta del usuario.
     * @return String
     */
    public String getIban() {
        return iban;
    }

    /** 
     * Establecer el número de cuenta del usuario.
     * @param iban El número de cuenta IBAN a almacenar.
     */
    public void setIban(String iban) {
        this.iban = iban;
    }
    
    /** 
     * Obtener el correo electrónico del usuario.
     * @return String
     */
    public String getEmail() {
        return email;
    }
 
    /** 
     * Establecer el correo electrónico del usuario.
     * @param email El correo electrónico a almacenar.
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /** 
     * Obtener el nombre del usuario.
     * @return String
     */
    public String getName() {
        return name;
    }
    
    /** 
     * Establecer el nombre del usuario.
     * @param name El nombre a almacenar.
     */
    public void setName(String name) {
        this.name = name;
    }
    
    /** 
     * Obtener el apellido del usuario.
     * @return String
     */
    public String getSurname() {
        return surname;
    }

    /** 
     * Establecer el apellido del usuario.
     * @param surname El apellido a almacenar.
     */
    public void setSurname(String surname) {
        this.surname = surname;
    }
    
    /** 
     * Obtener la contraseña del usuario
     * @return String
     */
    public String getPassword() {
        return password;
    }
    
    /** 
     * Establecer la contraseña del usuario.
     * @param password La contraseña a almacenar.
     */
    public void setPassword(String password) {
        this.password = password;
    }
    
    /** 
     * Obtener si el usuario pertenece al plan premium.
     * @return boolean
     */
    public boolean isPremium() {
        return premium;
    }

    /** 
     * Establecer si el usuario pertenece al plan premium.
     * @param isPremium True si es del plan premium y False del estandar.
     */
    public void setPremium(boolean isPremium) {
        this.premium = isPremium;
    }

    /** 
     * Obtener si el usuario es personal especializado (experto).
     * @return boolean
     */
    public boolean isExpert() {
        return expert;
    }

    /** 
     * Establecer si el usuario es personal especializado (experto).
     * @param isExpert True si lo es y False si no.
     */
    public void setExpert(boolean isExpert) {
        this.expert = isExpert;
    }
    
    /** 
     * Obtener la retribución acumulada del usuario por los resúmenes publicados.
     * @return double
     */
    public double getAccRetribution() {
        return accRetribution;
    }
    
    /** 
     * Establecer la retribución acumulada del usuario por los resúmenes publicados.
     * @param accRetribution La cuantía de la retribución a almacenar.
     */
    public void setAccRetribution(double accRetribution) {
        this.accRetribution = accRetribution;
    }
    
    /** 
     * Método de comparación de objetos para el usuario.
     * @param user El objeto usuario a comparar.
     * @return boolean
     */
    public boolean equalsTo(User user){
        if(this.id.equals(user.getId()) && this.email.equals(user.getEmail()) && this.name.equals(user.getName())
        && this.surname.equals(user.getSurname()) && this.expert == user.isExpert() && this.premium==user.isPremium() 
        && this.accRetribution==user.getAccRetribution() && this.iban.equals(user.getIban()) 
        && this.password.equals(user.getPassword())) return true;
        return false;
    }

}
