package es.upm.dit.apsv.serverresumen.ratings;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


@Service
public class RatingService {

    private final RatingRepository ratingRepository;
    private double counter;

    @Autowired
    public RatingService (RatingRepository ratingRepository){
        this.ratingRepository=ratingRepository;
    }
    
    /** 
     * Obtener del repositorio la lista de todas las valoraciones realizadas
     * a todos los resúmenes almacenados.
     * Útil para desarrolladores.
     * @return List<Rating>
     */
    public List<Rating> getRatings(){
        return ratingRepository.findAll();
    }
    
    /** 
     * Añadir una valoración al repositorio.
     * @param rating El objeto valoración a almacenar;
     * Contiene la cuantía de la valoración, el usuario y el resumen al que pertenece.
     * @return ResponseEntity<Rating>
     * @throws Exception
     */
    public ResponseEntity<Rating> addRating(Rating rating) throws Exception{
        if(rating.getRating() > 5 || rating.getRating() < 0){
            throw new Exception(
                "La valoración: " +
                rating.getRating() + 
                " queda fuera de rango. Debe quedar comprendida entre [0, 5]."
            );
        }

        Rating ratingExist = ratingRepository.findByUserandResume(
            rating.getResume().getResumeID(), 
            rating.getUser().getId()
        );
        
        if (ratingExist == null) {
            Rating result= ratingRepository.save(rating);
            return ResponseEntity.created(new URI("/valoracion/post/" + result.getRatingID())).body(result);
        } else {
            throw new Exception(
                "El resumen del libro: " + 
                rating.getResume().getBookTitle() + 
                " ya ha sido valorado por el usuario de email: " + 
                rating.getUser().getEmail() +
                ". \nRecomendación: Utilizar método PUT."
            );
        }
        
    }
    
    /** 
     * Actualizar una valoración en el repositorio.
     * @param rating El objeto valoración a almacenar: 
     * Contiene la cuantía de la valoración, el usuario y el resumen al que pertenece.
     * @throws Exception
     */
    public void updateRating(Rating rating) throws Exception{
        if(rating.getRating() > 5 || rating.getRating() < 0){
            throw new Exception(
                "La valoración: " +
                rating.getRating() + 
                " queda fuera de rango. Debe quedar comprendida entre [0, 5]."
            );
        }

        Rating ratingExist = ratingRepository.findByUserandResume(
            rating.getResume().getResumeID(), 
            rating.getUser().getId()
        );
        
        if (ratingExist != null) {
            ratingRepository.updateRating(
                rating.getResume().getResumeID(), 
                rating.getUser().getId(),
                rating.getRating()
            );
        } else {
            throw new Exception(
                "El resumen del libro: " + 
                rating.getResume().getBookTitle() + 
                " no cuenta con una valoración del usuario con email: " + 
                rating.getUser().getEmail() +
                ". \nRecomendación: Utilizar método POST."
            );
        }
    }
    
    /** 
     * Obtener un listado del repositorio con la cuantía de las valoraciones
     * de un resumen concreto, para calcular su valoración media.
     * @param resume_id El resumen del que queremos la valoración media.
     * @return double
     * @throws Exception
     */
    public double getRatingsOfResume(Long resume_id) throws Exception{
        List<Rating> list = ratingRepository.findRatingsByResume(resume_id);

        // if(list.size() == 0){
        //     throw new Exception(
        //         "El resumen con identificador: " +
        //         resume_id +
        //         " no tiene ninguna valoración realizada: No se puede calcular la valoración media."
        //     );
        // }

        this.counter=0;
        list.forEach((rating) -> {
            counter = counter + rating.getRating();
        }
        );
        return (counter/list.size());
    }

}
