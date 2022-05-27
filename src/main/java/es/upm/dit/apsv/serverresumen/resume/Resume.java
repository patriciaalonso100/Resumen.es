package es.upm.dit.apsv.serverresumen.resume;

import javax.persistence.*;

import es.upm.dit.apsv.serverresumen.user.User;

@Entity
@Table
public class Resume {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(
        name="resumeID",
        updatable=false,
        unique = true
    )
    private Long resumeID;

    @Column(
        name="bookTitle",
        nullable = false
    )
    private String bookTitle;

    @Column(
        name="authorName",
        nullable = false
    )
    private String authorName;

    @Column(
        name = "publisher",
        nullable = false
    )
    private String publisher;

    @Lob
    @Column(
        name = "resumeText",
        columnDefinition = "TEXT",
        nullable = false
    )
    private String resumeText;

    @Lob
    @Column(
        name = "resume",
        columnDefinition = "longblob",
        nullable = false
    )
    private byte[] resume;

    @Lob
    @Column(
        name = "coverpage",
        columnDefinition = "longblob"
    )
    private byte[] coverPage;

    @Lob
    @Column(
        name = "audio",
        columnDefinition = "longblob"
    )
    private byte[] audio;
    
    @Column(
        name = "isVerified",
        updatable = true,
        nullable = false
    )
    private boolean isVerified;
 
    @Column(
        name="isPremium",
        updatable = true,
        nullable = false
    )
    private boolean isPremium;

    @ManyToOne
    @JoinColumn(name="user", referencedColumnName="id", updatable = false)
    private User user;

    public Resume(){}
   
    public Resume(Long resumeID, String bookTitle, String authorName, String publisher, String resumeText,
            byte[] resume, byte[] coverPage, byte[] audio, boolean isVerified, boolean isPremium) {
        this.resumeID = resumeID;
        this.bookTitle = bookTitle;
        this.authorName = authorName;
        this.publisher = publisher;
        this.resumeText = resumeText;
        this.resume = resume;
        this.coverPage = coverPage;
        this.audio = audio;
        this.isVerified = isVerified;
        this.isPremium = isPremium;
    }
    
    /** 
     * Obtener el usuario que creó el resumen.
     * @return User
     */
    public User getUser() {
        return user;
    }
    
    /** 
     * Establecer el usuario que creó el resumen.
     * @param user El usuario a almacenar.
     */
    public void setUser(User user) {
        this.user = user;
    }
    
    /** 
     * Obtener el identificador del resumen.
     * @return Long
     */
    public Long getResumeID() {
        return resumeID;
    }
    
    /** 
     * Establecer el identificador del resumen.
     * @param resumeID El identificador.
     */
    public void setResumeID(Long resumeID) {
        this.resumeID = resumeID;
    }
    
    /** 
     * Obtener el título del libro del que se hace el resumen.
     * @return String
     */
    public String getBookTitle() {
        return bookTitle;
    }
    
    /** 
     * Establecer el título del libro del que se hace el resumen.
     * @param bookTitle El título del libro.
     */
    public void setBookTitle(String bookTitle) {
        this.bookTitle = bookTitle;
    }
    
    /** 
     * Obtener el nombre del autor del libro del que se hace el resumen.
     * @return String
     */
    public String getAuthorName() {
        return authorName;
    }
    
    /** 
     * Establecer el nombre del autor del libro del que se hace el resumen.
     * @param authorName
     */
    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    /** 
     * Obtener la editorial que publicó el libro del que se hace el resumen.
     * @return String
     */
    public String getPublisher() {
        return publisher;
    }
    
    /** 
     * Establecer la editorial que publicó el libro del que se hace el resumen.
     * @param publisher El nombre de la editorial.
     */
    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }
    
    /** 
     * Obtener un breve resumen del resumen que esquematice la idea.
     * @return String
     */
    public String getResumeText() {
        return resumeText;
    }
    
    /** 
     * Establecer un breve resumen del resumen que esquematice la idea.
     * @param resumeText El mini-resumen.
     */
    public void setResumeText(String resumeText) {
        this.resumeText = resumeText;
    }
    
    /** 
     * Obtener si el resumen ya ha sido verificado o no.
     * @return boolean
     */
    public boolean isVerified() {
        return isVerified;
    }
    
    /** 
     * Establecer la verificación del resumen.
     * @param isVerified True si se verifica y False si no.
     */
    public void setVerified(boolean isVerified) {
        this.isVerified = isVerified;
    }

    /** 
     * Obtener si el resumen es del plan premium o del estandar.
     * @return boolean
     */
    public boolean isPremium() {
        return isPremium;
    }
    
    /**
     * Establecer si el resumen es el del plan premium o del estandar. 
     * @param isPremium True si es del plan premium y False del estandar.
     */
    public void setPremium(boolean isPremium) {
        this.isPremium = isPremium;
    }

    /** 
     * Obtener el PDF del resumen.
     * @return byte[]
     */
    public byte[] getResume() {
        return resume;
    }
    
    /** 
     * Establecer el byte array que representa el PDF del resumen.
     * @param resume El array de bytes.
     */
    public void setResume(byte[] resume) {
        this.resume = resume;
    }

    /** 
     * Obtener la portada del resumen.
     * @return byte[]
     */
    public byte[] getCoverPage() {
        return coverPage;
    }
    
    /** 
     * Establecer el byte array que representa la portada del resumen.
     * @param coverPage El array de bytes.
     */
    public void setCoverPage(byte[] coverPage) {
        this.coverPage = coverPage;
    }

    /** 
     * Obtener el audio del resumen.
     * @return byte[]
     */
    public byte[] getAudio() {
        return audio;
    }
    
    /** 
     * Establecer el byte array que representa el audio del resumen.
     * @param audio El array de bytes.
     */
    public void setAudio(byte[] audio) {
        this.audio = audio;
    }
    
    /** 
     * Método de comparación de objetos para el resumen.
     * @param resume El objeto resumen a comparar.
     * @return boolean
     */
    public boolean equalsTo(Resume resume) {
        if(this.resumeID.equals(resume.getResumeID()) && this.bookTitle.equals(resume.getBookTitle()) 
        && this.authorName.equals(resume.getAuthorName()) && this.publisher.equals(resume.getPublisher()) && 
        this.resumeText.equals(resume.getResumeText()) && this.isVerified==resume.isVerified() && 
        this.isPremium==resume.isPremium() && this.user.equalsTo(resume.getUser())) return true;
        return false;
    }

}
