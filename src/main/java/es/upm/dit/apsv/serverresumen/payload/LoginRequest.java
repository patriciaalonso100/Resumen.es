package es.upm.dit.apsv.serverresumen.payload;

import javax.validation.constraints.NotBlank;

public class LoginRequest {
	@NotBlank
    private String email;

	@NotBlank
	private String password;

	
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
	 * Obtener la contraseña del usuario.
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
}
