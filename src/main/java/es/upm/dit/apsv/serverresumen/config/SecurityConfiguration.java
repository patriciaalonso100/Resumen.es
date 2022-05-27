package es.upm.dit.apsv.serverresumen.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import es.upm.dit.apsv.serverresumen.jwt.AuthEntryPointJwt;
import es.upm.dit.apsv.serverresumen.jwt.AuthTokenFilter;
import es.upm.dit.apsv.serverresumen.services.UserDetailsServiceImpl;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
		// securedEnabled = true,
		// jsr250Enabled = true,
		prePostEnabled = true)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
	@Autowired
	UserDetailsServiceImpl userDetailsService;
	@Autowired
	private AuthEntryPointJwt unauthorizedHandler;

	
	/** 
	 * Método para la obtención del token JWT de autenticación.
	 * @return AuthTokenFilter
	 */
	@Bean
	public AuthTokenFilter authenticationJwtTokenFilter() {
		return new AuthTokenFilter();
	}

	
	/** 
	 * Método para la definición del cifrado de las contraseñas.
	 * @param authenticationManagerBuilder
	 * @throws Exception
	 */
	@Override
	public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
		authenticationManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
	}

	
	/** 
	 * Método para obtener el Bean de autenticación.
	 * @return AuthenticationManager
	 * @throws Exception
	 */
	@Bean
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

	
	/** 
	 * Método para generar la función de cifrado de contraseñas con Bcrypt.
	 * @return PasswordEncoder
	 */
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	
	/** 
	 * Seguridad web.
	 * Permite el acceso a la ruta de la base de datos.
	 * @param web El parámetro de configuración de seguridad web.
	 * @throws Exception
	 */
	@Override
    public void configure(WebSecurity web) throws Exception {
        web
            .ignoring()
            .antMatchers("/h2-console/**");
    }
    
	
	/** 
	 * Seguridad HTTP.
	 * Define a qué rutas se puede acceder y con qué condiciones.
	 * @param http El parámetro de configuración de seguridad HTTP.
	 * @throws Exception
	 */
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.cors().and().csrf().disable()
			.exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
			.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
			.authorizeRequests()
				.antMatchers("/api/auth/**").permitAll()
				.antMatchers("/**").permitAll()
			.anyRequest().authenticated();
		http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
	}
}