package es.upm.dit.apsv.serverresumen.services;

import java.util.Collection;
import java.util.Objects;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import es.upm.dit.apsv.serverresumen.user.User;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class UserDetailsImpl implements UserDetails {
	private static final long serialVersionUID = 1L;
	private Long id;
	private String name;
	private String email;
	@JsonIgnore
	private String password;

	private Collection<? extends GrantedAuthority> authorities;
	public UserDetailsImpl(Long id, String email, String name, String surname, Boolean premium,
		Boolean expert, Double accRetribution, String iban, String password) {
		this.id = id;
		this.name = name;
		this.email = email;
		this.password = password;
	}
	
	/** 
	 * Construir un objeto de detalles de usuario a partir de un objeto de usuario.
	 * @param user El usuario de base.
	 * @return UserDetailsImpl
	 */
	public static UserDetailsImpl build(User user) {
		return new UserDetailsImpl(
                user.getId(),
				user.getEmail(),
				user.getName(),
				user.getSurname(),
				user.isPremium(),
				user.isExpert(),
				user.getAccRetribution(),
				user.getIban(),
				user.getPassword());
	}
	
	/** 
	 * Obtener la colección de autoridades.
	 * @return Collection<? extends GrantedAuthority>
	 */
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}
	
	/** 
	 * Obtener el identificador del usuario.
	 * @return Long
	 */
	public Long getId() {
		return id;
	}
	
	/** 
	 * Obtener el correo electrónico del usuario.
	 * @return String
	 */
	public String getEmail() {
		return email;
	}
	
	/** 
	 * Obtener la contraseña del usuario.
	 * @return String
	 */
	@Override
	public String getPassword() {
		return password;
	}
	
	/** 
	 * Obtener el nombre del usuario.
	 * @return String
	 */
	@Override
	public String getUsername() {
		return name;
	}
	
	/** 
	 * Obtener si la cuenta se ha expirado o no.
	 * @return boolean
	 */
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}
	
	/** 
	 * Obtener si la cuenta está desbloqueada.
	 * @return boolean
	 */
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}
	
	/** 
	 * Obtener si las credenciales han expirado.
	 * @return boolean
	 */
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}
	
	/** 
	 * Obtener si la cuenta está habilitada.
	 * @return boolean
	 */
	@Override
	public boolean isEnabled() {
		return true;
	}
	
	/** 
	 * Método equals para objetos de tipo UserDetailsImpl.
	 * @param o El objeto a comparar.
	 * @return boolean
	 */
	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		UserDetailsImpl user = (UserDetailsImpl) o;
		return Objects.equals(id, user.id);
	}
}
