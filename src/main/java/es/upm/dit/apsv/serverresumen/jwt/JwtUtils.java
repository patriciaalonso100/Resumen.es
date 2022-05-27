package es.upm.dit.apsv.serverresumen.jwt;

import java.util.Date;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.*;

import es.upm.dit.apsv.serverresumen.services.UserDetailsImpl;

@Component
public class JwtUtils {
	private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);
	@Value("CEE688B1DFC4091079B6439F90878A136ADD8AA83419E5347F85A202538FB0C0")
	private String jwtSecret;
	
	/** 
	 * Generación del token JWT.
	 * @param authentication Objeto de autenticación para obtener credenciales del usuario autenticado.
	 * @return String
	 */
	public String generateJwtToken(Authentication authentication) {
		UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
		return Jwts.builder()
				.setSubject((userPrincipal.getUsername()))
				.setIssuedAt(new Date())
				.signWith(SignatureAlgorithm.HS512, jwtSecret)
				.compact();
	}
	
	/** 
	 * Obtener nombre de usuario a partir del token JWT.
	 * @param token El token JWT.
	 * @return String
	 */
	public String getUserNameFromJwtToken(String token) {
		return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
	}
	
	/** 
	 * Validar el token JWT.
	 * @param authToken El token JWT.
	 * @return boolean
	 */
	public boolean validateJwtToken(String authToken) {
		try {
			Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
			return true;
		} catch (SignatureException e) {
			logger.error("Firma JWT no válida: {}", e.getMessage());
		} catch (MalformedJwtException e) {
			logger.error("Token JWT no válido: {}", e.getMessage());
		} catch (ExpiredJwtException e) {
			// No hay fecha de expiración por lo que este error no debe lanzarse. Queda documentado para posibles futuras implementaciones de esta web.
			logger.error("Token JWT expirado: {}", e.getMessage());
		} catch (UnsupportedJwtException e) {
			logger.error("Token JWT no soportado: {}", e.getMessage());
		} catch (IllegalArgumentException e) {
			logger.error("Argumento inesperado: {}", e.getMessage());
		}
		return false;
	}
}
