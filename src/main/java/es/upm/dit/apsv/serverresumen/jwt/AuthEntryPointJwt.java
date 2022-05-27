package es.upm.dit.apsv.serverresumen.jwt;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component
public class AuthEntryPointJwt implements AuthenticationEntryPoint {
	private static final Logger logger = LoggerFactory.getLogger(AuthEntryPointJwt.class);
	
	/** 
	 * Método para comprobar la autorización cuando se intenta autenticar un usuario con JWT.
	 * @param request Petición HTTP.
	 * @param response Respuesta HTTP.
	 * @param authException Excepción de autenticación.
	 * @throws IOException
	 * @throws ServletException
	 */
	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException authException) throws IOException, ServletException {
		logger.error("Error: {}", authException.getMessage());
		response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Error: No autorizado");
	}
}
