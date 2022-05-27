package es.upm.dit.apsv.serverresumen.ratings;

import javax.persistence.*;

import es.upm.dit.apsv.serverresumen.resume.Resume;
import es.upm.dit.apsv.serverresumen.user.User;

@Entity
@Table
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(
        name="ratingID",
        updatable = false,
        unique = true,
        nullable = false
    )
    private Long ratingID;
    @Column(
        name="rating",
        unique = false,
        nullable = false
    )
    private double rating;

    @ManyToOne
    @JoinColumn(name="user", referencedColumnName="id", updatable = false, nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name="resume", referencedColumnName="resumeID",updatable = false, nullable =false)
    private Resume resume;

    public Rating(){}
    public Rating(Long ratingID, double rating, User user, Resume resume) {
        this.ratingID = ratingID;
        this.rating = rating;
        this.user = user;
        this.resume = resume;
    }
    
    /** 
     * Obtener el ID de la valoración.
     * @return Long
     */
    public Long getRatingID() {
        return ratingID;
    }
    
    /** 
     * Establecer el ID de la valoración.
     * @param ratingID El ID a almacenar.
     */
    public void setRatingID(Long ratingID) {
        this.ratingID = ratingID;
    }
    
    /** 
     * Obtener la valoración de un resumen.
     * @return double
     */
    public double getRating() {
        return rating;
    }
    
    /** 
     * Establecer la valoración de un resumen.
     * @param rating La valoración a almacenar.
     */
    public void setRating(double rating) {
        this.rating = rating;
    }
    
    /** 
     * Obtener el usuario que realizó una valoración.
     * @return User
     */
    public User getUser() {
        return user;
    }

    /** 
     * Establecer el usuario que ha realizado una valoración.
     * @param user El usuario a almacenar.
     */
    public void setUser(User user) {
        this.user = user;
    }
    
    /** 
     * Obtener el resumen correspondiente a la valoración realizada.
     * @return Resume
     */
    public Resume getResume() {
        return resume;
    }
    
    /** 
     * Establecer a qué resumen pertenece la valoración realizada.
     * @param resume El resumen a almacenar.
     */
    public void setResume(Resume resume) {
        this.resume = resume;
    }
    
    /** 
     * Método de comparación de objetos para la valoración.
     * @param rating El objeto valoración a comparar.
     * @return boolean
     */
    public boolean equalsTo(Rating rating){
        if(this.ratingID.equals(rating.getRatingID()) && this.rating == rating.getRating() &&
        this.resume.equalsTo(rating.getResume()) && this.user.equalsTo(rating.getUser())) return true;
        return false;

    }
    
}
