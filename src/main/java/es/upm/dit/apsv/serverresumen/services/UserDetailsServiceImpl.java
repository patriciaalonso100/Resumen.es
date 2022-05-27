package es.upm.dit.apsv.serverresumen.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import es.upm.dit.apsv.serverresumen.user.User;
import es.upm.dit.apsv.serverresumen.user.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
	@Autowired
	UserRepository userRepository;
	
	/** 
	 * Construir un objeto de tipo UserDetailsImpl a raiz de un objeto de tipo usuario
	 * obtenido del repositorio a través del correo electrónico.
	 * @param email El correo electrónico del usuario a localizar.
	 * @return UserDetails
	 * @throws UsernameNotFoundException
	 */
	@Override
	@Transactional
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		User user = userRepository.findUserByEmail(email);
		return UserDetailsImpl.build(user);
	}
}
