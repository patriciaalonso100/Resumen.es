package es.upm.dit.apsv.serverresumen.Repositorytest;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;


import java.util.Optional;

import es.upm.dit.apsv.serverresumen.user.*;
import es.upm.dit.apsv.serverresumen.resume.*;
import es.upm.dit.apsv.serverresumen.ratings.*;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ServerresumenApplicationTests {
    @Autowired
	private UserRepository userRepo;

	@Autowired
	private ResumeRepository resumeRepo;

	@Autowired
	private RatingRepository ratingRepo;

	@Test
	final void testUserService(){
		User user = new User();
		user.setId(1L); 
		user.setName("Pedro");
		user.setSurname("Sanz");
		user.setEmail("p.sanz@alumnos.upm.es");
		user.setPassword("123456");
		user.setPremium(true);
		user.setAccRetribution(0.0);
		user.setIban("ES6000491500051234567892");

		//save
		userRepo.save(user);
		Optional<User> user2 = userRepo.findById(1L); 
		assertTrue(user.equalsTo(user2.get()));



		//findUserByEmail
		User userFound = userRepo.findUserByEmail(user.getEmail());
		assertTrue(user.equalsTo(userFound));

		//updateName
		userRepo.updateName("Antonio", 1L);
		assertEquals("Antonio",userRepo.findById(1L).get().getName());


		//updateSurname
		userRepo.updateSurname("Lopez", 1L);
		assertEquals("Lopez", userRepo.findById(1L).get().getSurname());

		//updateUserToPremium
		userRepo.updateUserToPremium(1L, true);
		assertEquals(true, userRepo.findById(1L).get().isPremium());

		//updateUserIban
		userRepo.updateUserIban(1L, "ES9420805801101238567891");
		assertEquals("ES9420805801101238567891", userRepo.findById(1L).get().getIban());

		//delete
		userRepo.delete(user);
        user2 = userRepo.findById(1L);
        assertFalse(user2.isPresent());

	}

	@Test
	final void testResumeService(){
		User user = new User();
		user.setId(1L); 
		user.setName("Pedro");
		user.setSurname("Sanz");
		user.setEmail("p.sanz@alumnos.upm.es");
		user.setPassword("123456");
		user.setPremium(true);
		user.setAccRetribution(0.0);
		user.setIban("ES6000491500051234567892");
		
		Resume resume = new Resume();
		byte[] bytes = new byte[3];
		resume.setResumeID(1L);
		resume.setBookTitle("Easy way to stop smoking");
		resume.setAuthorName("Allen Carr's");
		resume.setPublisher("Clarity Marketing USA LLC");
		resume.setResumeText("Libro de autoayuda para dar pautas sobre como dejar de fumar.");
		resume.setUser(user);
		resume.setAudio(bytes);
		resume.setCoverPage(bytes);
		resume.setResume(bytes);



		//save
		userRepo.save(user);
		resumeRepo.save(resume);

		Optional<Resume> resumeSave = resumeRepo.findById(1L); 
		assertTrue(resume.equalsTo(resumeSave.get()));



		//findResumeVerified
		Resume resumeFound = resumeRepo.findResumeNotVerified().get(0);
		assertTrue(resume.equalsTo(resumeFound));


		//updateResumeToPremium
		resumeRepo.updateResumeToPremium(1L);
		assertEquals(true, resumeRepo.findById(1L).get().isPremium());


		//updateResumeToVerified
		resumeRepo.updateResumeToVerified(1L);
		assertEquals(true, resumeRepo.findById(1L).get().isVerified());

		//findResumeNotVerified
		//creamos una lista con el resumen verificado
		resume.setVerified(true);
		resume.setPremium(true);
		resumeFound = resumeRepo.findResumeVerified().get(0);
		assertTrue(resume.equalsTo(resumeFound));
		

		//findResumeByUser
		resumeFound = resumeRepo.findResumeByUser(user.getId()).get(0);
		assertTrue(resume.equalsTo(resumeFound));

		//delete
		resumeRepo.delete(resume);
        Optional<Resume> resumeDelete = resumeRepo.findById(1L);
        assertFalse(resumeDelete.isPresent());


		userRepo.delete(user);
        Optional<User> user2 = userRepo.findById(1L);
        assertFalse(user2.isPresent());

	}

	@Test
	final void testRatingService(){
		User user = new User();
		user.setId(1L);
		user.setName("Victoria");
		user.setSurname("Ruiz");
		user.setEmail("victoria@alumnos.upm.es");
		user.setPassword("vicky");
		user.setPremium(true);
		user.setIban("ES2 1146 5010 07 22030876295");

		Resume resume = new Resume();
		resume.setResumeID(1L);
		resume.setBookTitle("El poder del ahora");
		resume.setAuthorName("Eckhart Tolle");
		resume.setPublisher("Anaya");
		resume.setResumeText("Un libro de autoayuda");
		resume.setUser(user);

		Rating rating = new Rating();
		rating.setRatingID(1L);
		rating.setRating(2.7);
		rating.setResume(resume);
		rating.setUser(user);



		//save
		userRepo.save(user);
		resumeRepo.save(resume);
		ratingRepo.save(rating);
		assertTrue(rating.equalsTo(ratingRepo.findById(1L).get()));

		//findRatingsbyResume
		Rating ratingsByResume = ratingRepo.findRatingsByResume(resume.getResumeID()).get(0);
		assertTrue(ratingsByResume.equalsTo(rating));

		//findByUserAndResume
		Rating ratingsByUserAndResume = ratingRepo.findByUserandResume(rating.getResume().getResumeID(),rating.getUser().getId());
		assertTrue(ratingsByUserAndResume.equalsTo(rating));

		//updateRating
		ratingRepo.updateRating(resume.getResumeID(),user.getId(),3.5);
		assertEquals(3.5, ratingRepo.findById(rating.getRatingID()).get().getRating());

		//delete
		ratingRepo.delete(rating);
		Optional<Rating> ratingDelete = ratingRepo.findById(1L);
		assertFalse(ratingDelete.isPresent());
		resumeRepo.delete(resume);
        Optional<Resume> resumeDelete = resumeRepo.findById(1L);
        assertFalse(resumeDelete.isPresent());

		userRepo.delete(user);
        Optional<User> user2 = userRepo.findById(1L);
        assertFalse(user2.isPresent());



	}

    
}
