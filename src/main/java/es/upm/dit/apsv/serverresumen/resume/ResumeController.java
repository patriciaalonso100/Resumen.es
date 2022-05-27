package es.upm.dit.apsv.serverresumen.resume;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController()
@RequestMapping(path = "/api")
public class ResumeController {

    private final ResumeService resumeService;
    @Autowired
    public ResumeController(ResumeService resumeService){
        this.resumeService = resumeService;
    
    }
    
    /** 
     * Obtener la lista de todos los resúmenes provenientes del servicio.
     * @return List<Resume>
     */
    @GetMapping("/resumen")
    public List<Resume> getResumes(){
        return resumeService.getResumes();
    }
    
    /** 
     * Obtener la lista de todos los resúmenes verificados provenientes del servicio.
     * @return List<Resume>
     */
    @GetMapping("/resumen/verificado")
    public List<Resume> getResumesVerified(){
        return resumeService.getResumesVerified();
    }
    
    /** 
     * Obtener la lista de todos los resúmenes no verificados provenientes del servicio.
     * @return List<Resume>
     */
    @GetMapping("/resumen/noverificado")
    public List<Resume> getResumesNotVerified(){
        return resumeService.getResumesNotVerified();
    }
    
    /** 
     * Obtener la lista de todos los resúmenes de un usuario provenientes del servicio.
     * @param user_id El identificador del usuario correspondiente.
     * @return List<Resume>
     */
    @GetMapping("/resumen/usuario")
    public List<Resume> getResumesByUser(@RequestParam("user_id") Long user_id){
        return resumeService.getResumesByUser(user_id);
    }

    /** 
     * Invocar al servicio para añadir un resumen al repositorio.
     * @param resume El objeto resumen a añadir.
     * @return ResponseEntity<Resume>
     * @throws Exception
     */
    @PostMapping("/resumen")
    public ResponseEntity<Resume> registerNewResume(@RequestBody Resume resume) throws Exception{
        return resumeService.addResume(resume);
    }
   
   /**
    * Invocar al servicio para actualizar un resumen a premium. 
    * @param resume_id El identificador del resumen a actualizar.
    */
   @PutMapping("/resumen/premium")
    public void updateResumeToPremium(@RequestParam("resume_id") Long resume_id) {
         resumeService.setPremium(resume_id);
    }
    
    /** 
     * Invocar al servicio para verificar un resumen.
     * @param resume_id El identificador del resumen.
     */
   @PutMapping("/resumen/verified")
   public void updateResumeToVerified(@RequestParam("resume_id") Long resume_id) {
        resumeService.setVerified(resume_id);
   }
    
}
