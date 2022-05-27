package es.upm.dit.apsv.serverresumen.resume;
import java.net.URI;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    @Autowired
    public ResumeService(ResumeRepository resumeRepository) {
        this.resumeRepository = resumeRepository;
    }
    
    /** 
     * Obtener un listado de todos los resúmenes almacenados.
     * útil para desarrolladores.
     * @return List<Resume>
     */
    public List<Resume> getResumes(){
        return resumeRepository.findAll();

    }
    
    /** 
     * Obtener un listado de todos los resúmenes pendientes de verificar.
     * Se mostrará al usuario experto.
     * @return List<Resume>
     */
    public List<Resume> getResumesNotVerified(){
        return resumeRepository.findResumeNotVerified();

    }
     
     /** 
      * Obtener un listado de todos los resúmenes verificados.
      * Se mostrará a los usuarios autenticados del plan premium y estándar.
      * El acceso se gestiona en frontend.
      * @return List<Resume>
      */
     public List<Resume> getResumesVerified(){
        return resumeRepository.findResumeVerified();

    }

    /** 
     * Obtener los resúmenes asociados a un identificador de usuario.
     * Se mostrarán a un usuario sus resúmenes creados.
     * @param user_id El identificador del usuario del que se quiere obtener el listado de resúmenes creados.
     * @return List<Resume>
     */
    public List<Resume> getResumesByUser(Long user_id){
        return resumeRepository.findResumeByUser(user_id);
    }

    /** 
     * Añadir un resumen al repositorio.
     * @param resume El objeto resumen a añadir.
     * @return ResponseEntity<Resume>
     * @throws Exception
     */
    public ResponseEntity<Resume> addResume(Resume resume) throws Exception {
        Resume result= resumeRepository.save(resume);
        return ResponseEntity.created(new URI("/resumen/" + result.getResumeID())).body(result);
    }

    
    /** 
     * Definir que el resumen pertenecerá al plan premium.
     * Solo podrá acceder a este método el usuario experto.
     * @param resume_id El identificador del resumen a subir de categoría.
     */
    public void setPremium(Long resume_id){
        resumeRepository.updateResumeToPremium(resume_id);
        
    }

    /** 
     * Definir que el resumen queda verificado para ser mostrado en la página principal.
     * Solo podrá acceder a este método el usuario experto.
     * @param resume_id El identificador del resumen a ser validado.
     */
    public void setVerified(Long resume_id){
        resumeRepository.updateResumeToVerified(resume_id);
        
    }

}
