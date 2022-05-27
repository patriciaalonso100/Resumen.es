package es.upm.dit.apsv.serverresumen.user;

import java.net.URISyntaxException;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.upm.dit.apsv.serverresumen.jwt.JwtUtils;
import es.upm.dit.apsv.serverresumen.payload.LoginRequest;
import es.upm.dit.apsv.serverresumen.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
	
	@Autowired
	AuthenticationManager authenticationManager;
	@Autowired
	UserRepository userRepository;
	@Autowired
	PasswordEncoder encoder;
	@Autowired
	JwtUtils jwtUtils;
	@Autowired
	UserService userService;
	
	/** 
	 * Punto de entrada a backend desde frontend para hacer login.
	 * @param loginRequest El objeto de Login con las credenciales del usuario.
	 * @return ResponseEntity<?>
	 */
	@PostMapping("/signin")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
		SecurityContextHolder.getContext().setAuthentication(authentication);
		
		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();	
		User user = userRepository.findUserByEmail(userDetails.getEmail());	
		return ResponseEntity.ok(user);
	}
	
	/** 
	 * Punto de entrada a backend desde frontend para registrarse.
	 * @param userRcv El objeto usuario enviado desde frontend.
	 * @return ResponseEntity<?>
	 * @throws URISyntaxException
	 */
	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@Valid @RequestBody User userRcv) throws URISyntaxException {
		User user = new User(userRcv.getEmail(),
							userRcv.getName(),
							userRcv.getSurname(),
							userRcv.isPremium(),
							userRcv.isExpert(),
							userRcv.getAccRetribution(),
							userRcv.getIban(),
							encoder.encode(userRcv.getPassword()));
		userRepository.save(user);
		return userService.addUser(user);
	}
}
