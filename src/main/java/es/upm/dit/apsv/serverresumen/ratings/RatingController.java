package es.upm.dit.apsv.serverresumen.ratings;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController()
@RequestMapping(path = "/api")
public class RatingController {
    
    private final RatingService ratingService;
    public static final Logger log = LoggerFactory.getLogger(RatingController.class);

    @Autowired
    public RatingController (RatingService ratingService){
        this.ratingService=ratingService;
    }
    
    /** 
     * Obtener una lista de todas las valoraciones.
     * Útil para desarrolladores.
     * @return List<Rating>
     */
    @GetMapping("/valoracion")
    public List<Rating> getRatings(){
        return ratingService.getRatings();
    }
    
    /** 
     * Establecimiento de una valoración nueva a un resumen.
     * @param rating La valoración dada por el usuario.
     * @return ResponseEntity<Rating>
     * @throws Exception
     */
    @PostMapping("/valoracion/post")
    public ResponseEntity<Rating> registerNewRating(@RequestBody Rating rating) throws Exception{
        return ratingService.addRating(rating);
    }
    
    /** 
     * Actualización de una valoración a un resumen que ya tenía.
     * @param rating La valoración dada por el usuario.
     * @throws Exception
     */
    @PutMapping("/valoracion/put")
    public void updateRating(@RequestBody Rating rating ) throws Exception{
        ratingService.updateRating(rating);
    }
    
    /** 
     * Obtener la media de todas las valoraciones de un resumen concreto.
     * @param resume_id El resumen del que se quiere obtener la valoración media.
     * @return double
     * @throws Exception
     */ 
    @GetMapping("/valoracionmedia")
    public double getRatingsOfResume(@RequestParam("resume_id") Long resume_id) throws Exception{
        System.out.print("\n " + ratingService.getRatingsOfResume(resume_id)+ "\n");
        return ratingService.getRatingsOfResume(resume_id);
    }

}
