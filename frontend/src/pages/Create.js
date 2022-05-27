import React from "react";
import Dropzone from "react-dropzone";
import  {useState, useLayoutEffect} from 'react';
import '../css/create.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { UserContext } from "../UserContext";

/**
 * Método para monitorizar el tamaño de la pantalla y poder adaptar la vista a distintos tamaños de pantalla
 * @returns {any}
 */
 function useWindowSize() {
    
    /** 
    * Variable almacenamiento ancho y largo de la pantalla
    */
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}

const CreateResume = () => {

    /**
     * CoverPage
     */
    const [fileCoverPage, setFileCoverPage] = useState(null);
    const handleDropCoverPage = acceptedFiles =>
    setFileCoverPage(acceptedFiles[0]);

    /**
     * PDF
     */
    const [filePdf, setFilePdf] = useState(null);
    const handleDropPdf = acceptedFiles => 
    setFilePdf(acceptedFiles[0]);
    
    /**
     * Audio
     */
    const [fileAudio, setFileAudio] = useState(null);
    const handleDropAudio = acceptedFiles =>
    setFileAudio(acceptedFiles[0]);

    /**
     * Handle resize
     */
    const [width, _height] = useWindowSize();
    
    /**
     * Handle navigate
     */
    const navigate = useNavigate();
    
    /**
     * Handle user
     */
    const {user, setUser} = useContext(UserContext);
   
    /**
     * Función que convierte en bytes los distintos archivos que debemos añadir para crear resúmenes
     * @param file
     */
    function fileToByteArray(file) {
        return new Promise((resolve, reject) => {
            try {
                let reader = new FileReader();
                let fileByteArray = [];
                reader.readAsArrayBuffer(file);
                reader.onload = function () {
                    let arrayBuffer = reader.result,
                            array = new Uint8Array(arrayBuffer);
                    for (const byte of array) {
                        fileByteArray.push(byte);
                    }
                    resolve(fileByteArray);
                };
            }
            catch (e) {
                reject(e);
            } 
        })
    }

    /**
     * Finaliza la creación de los resúmenes
     */
    const handleFinish = async () => {

        /**
         * Obtenemos los valores de los distintos inputs
         */
        let bookTitleInput = document.getElementById("inputBT").value;
        let authorNameInput = document.getElementById("inputNA").value;
        let editorialInput = document.getElementById("inputED").value;
        let resumenInput = document.getElementById("inputRES").value;

        let pdfAsByteArray = filePdf ? await fileToByteArray(filePdf) : null;
        let audioAsByteArray = fileAudio ? await fileToByteArray(fileAudio) : null;
        let coverPageAsByteArray = fileCoverPage ? await fileToByteArray(fileCoverPage) : null;

        var postData = {};
        
        /**
         * Creamos el elemento que vamos a guardar en la base de datos.
         * Diferenciando entre la creación de un resúmen por parte de un usuario experto y uno que no lo sea.
         */
        if(user.expert === true) {
            postData = {
                bookTitle: bookTitleInput,
                authorName: authorNameInput,
                publisher: editorialInput,
                resumeText: resumenInput,
                verified: true,
                premium: false,
                user: {id: user.id},
                resume: pdfAsByteArray,
                coverPage: coverPageAsByteArray,
                audio: audioAsByteArray
            };
        } else {
            postData = {
                bookTitle: bookTitleInput,
                authorName: authorNameInput,
                publisher: editorialInput,
                resumeText: resumenInput,
                verified: false,
                premium: false,
                user: {id: user.id},
                resume: pdfAsByteArray,
                coverPage: coverPageAsByteArray,
                audio: audioAsByteArray
            };
        }

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
        };      

        /**
         * Petición post para guardar el resumen en la base de datos.
         * Tras guardar el resumen correctamente se redirige al usuario a la página de Home
         */
        await axios.post(`http://localhost:8080/api/resumen`, postData, axiosConfig)
        .then(res => {
            navigate('/');
        }).catch(err => {
            console.log(err);
            window.location.reload(false);
        })
    }

    if (width<768){
        return(
            <div>
                <div className="contCreate">
                    <div className="titleCreate">
                        <h2 id="h2Create">Añade un resumen</h2>
                        <p className="forgot-passCreate" id="pCreate">Para crear un resumen nuevo debe rellenar los siguientes campos</p>
                    </div>
                    <div className="sub_contCreate">
    
                        <div className="formCreate">
                            <label id="labelCreate">
                                <span>Título</span>
                                <input id="inputBT" type="text" placeholder="Introduzca el título"/>
                            </label>
                            <label id="labelCreate">
                                <span>Nombre del autor</span>
                                <input id="inputNA" type="text" placeholder="Introduzca el nombre del autor"/>
                            </label>
                            <label id="labelCreate">
                                <span>Editorial</span>
                                <input id="inputED" type="text" placeholder="Introduzca la editorial"/>
                            </label>
                            <label id="labelCreate">
                                    <span>Añada una descripción breve de su resumen</span>
                                    <input id="inputRES" type="text" placeholder="Introduzca el resumen"></input>
                            </label>
                        </div>
    
                        <div className="dropzoneCreate_mobile">
                            <div className="subDropzone">
                                <p className="labelCreateDropzone">Portada del Libro</p>
                                <Dropzone
                                    onDrop={handleDropCoverPage}
                                    accept="image/*"
                                    minSize={1024}
                                    maxSize={52428800}
                                >        
                                {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject }) => { 
                                    const additionalClass = isDragAccept ? "accept" : isDragReject ? "reject" : "";
                                    return (
                                    <div {...getRootProps({ className: `dropzone ${additionalClass}`})}>
                                        <input {...getInputProps()} />
                                        <span className="spanDropzone">{isDragActive ? "📂" : "📁"}</span>
                                        <p className="dropText">Drag'n'drop images, or click to select files</p>
                                    </div>
                                    );
                                }}
                                </Dropzone>
                                <div>
                                <p id="pCreate">Archivo añadido:</p>
                                <ul>
                                    <li className="dropText">{fileCoverPage ? fileCoverPage.name : ' '}</li>
                                </ul>
                            </div>
                            </div>
                            <div className="subDropzone">
                                <p className="labelCreateDropzone">Adjunte el resumen en PDF</p>
                                <Dropzone
                                    onDrop={handleDropPdf}
                                    accept="application/pdf"
                                    minSize={1024}
                                    maxSize={52428800}
                                >        
                                {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject }) => { 
                                    const additionalClass = isDragAccept ? "accept" : isDragReject ? "reject" : "";
                                    return (
                                    <div {...getRootProps({ className: `dropzone ${additionalClass}`})}>
                                        <input id="filePDF" {...getInputProps()} />
                                        <span className="spanDropzone">{isDragAccept ? "📂" : "📁"}</span>
                                        <p className="dropText">Drag'n'drop images, or click to select files</p>
                                    </div>
                                    );
                                }}
                                </Dropzone>
                                <p id="pCreate">Archivo añadido:</p>
                                <ul>
                                <li className="dropText">{filePdf ? filePdf.name : ' '}</li>
                                </ul>
                            </div>
                            <div className="subDropzone">
                                <p className="labelCreateDropzone">Adjunte el resumen en audio</p>
                                <Dropzone
                                    onDrop={handleDropAudio}
                                    accept="audio/*"
                                    minSize={1024}
                                    maxSize={52428800}
                                >        
                                {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject }) => { 
                                    const additionalClass = isDragAccept ? "accept" : isDragReject ? "reject" : "";
                                    return (
                                    <div {...getRootProps({ className: `dropzone ${additionalClass}`})}>
                                        <input {...getInputProps()} />
                                        <span className="spanDropzone">{isDragActive ? "📂" : "📁"}</span>
                                        <p className="dropText">Drag'n'drop images, or click to select files</p>
                                    </div>
                                    );
                                }}
                                </Dropzone>
                                <p id="pCreate">Archivo añadido:</p>
                                <ul>
                                <li className="dropText">{fileAudio ? fileAudio.name : ' '}</li>
                                </ul>
                            </div>
                            
                        </div>
    
                        <button className="buttonCreate" type="button" id="submitCreate" onClick={handleFinish}>Finalizar</button>
    
                    </div>
    
                </div>
            </div>
        )
    }else{
        return(
            <div>
                <div className="contCreate">
                    <div className="titleCreate">
                        <h2 id="h2Create">Añade un resumen</h2>
                        <p className="forgot-passCreate" id="pCreate">Para crear un resumen nuevo debe rellenar los siguientes campos</p>
                    </div>
                    <div className="sub_contCreate">
    
                        <div className="formCreate">
                            <label id="labelCreate">
                                    <span>Título</span>
                                    <input id="inputBT" type="text" placeholder="Introduzca el título"/>
                            </label>
                            <label id="labelCreate">
                                    <span>Nombre del autor</span>
                                    <input id="inputNA" type="text" placeholder="Introduzca el nombre del autor"/>
                            </label>
                            <label id="labelCreate">
                                    <span>Editorial</span>
                                    <input id="inputED" type="text" placeholder="Introduzca la editorial"/>
                            </label>
                            <label id="labelCreate">
                                    <span>Añada una descripción breve de su resumen</span>
                                    <input id="inputRES" type="text" placeholder="Introduzca el resumen"></input>
                            </label>
                        </div>
    
                        <div className="dropzoneCreate">
                            <div className="subDropzone">
                                <p className="labelCreateDropzone">Portada del Libro</p>
                                <Dropzone
                                    onDrop={handleDropCoverPage}
                                    accept="image/*"
                                    minSize={1024}
                                    maxSize={52428800}
                                >        
                                {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject }) => { 
                                    const additionalClass = isDragAccept ? "accept" : isDragReject ? "reject" : "";
                                    return (
                                    <div {...getRootProps({ className: `dropzone ${additionalClass}`})}>
                                        <input {...getInputProps()} />
                                        <span className="spanDropzone">{isDragAccept ? "📂" : "📁"}</span>
                                        <p className="dropText">Drag'n'drop images, or click to select files</p>
                                    </div>
                                    );
                                }}
                                </Dropzone>
                                <div>
                                <p id="pCreate">Archivo añadido:</p>
                                <ul>
                                <li className="dropText">{fileCoverPage ? fileCoverPage.name : ' '}</li>
                                </ul>
                            </div>
                            </div>
                            <div className="subDropzone">
                                <p className="labelCreateDropzone">Adjunte el resumen en PDF</p>
                                <Dropzone
                                    onDrop={handleDropPdf}
                                    accept="application/pdf"
                                    minSize={1024}
                                    maxSize={52428800}
                                >        
                                {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject }) => { 
                                    const additionalClass = isDragAccept ? "accept" : isDragReject ? "reject" : "";
                                    return (
                                    <div {...getRootProps({ className: `dropzone ${additionalClass}`})}>
                                        <input id="filePDF" {...getInputProps()} />
                                        <span className="spanDropzone">{isDragAccept ? "📂" : "📁"}</span>
                                        <p className="dropText">Drag'n'drop images, or click to select files</p>
                                    </div>
                                    );
                                }}
                                </Dropzone>
                                <p id="pCreate">Archivo añadido:</p>
                                <ul>
                                <li className="dropText">{filePdf ? filePdf.name : ' '}</li>
                                </ul>
                            </div>
                            <div className="subDropzone">
                                <p className="labelCreateDropzone">Adjunte el resumen en audio</p>
                                <Dropzone
                                    onDrop={handleDropAudio}
                                    accept="audio/*"
                                    minSize={1024}
                                    maxSize={52428800}
                                >        
                                {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject }) => { 
                                    const additionalClass = isDragAccept ? "accept" : isDragReject ? "reject" : "";
                                    return (
                                    <div {...getRootProps({ className: `dropzone ${additionalClass}`})}>
                                        <input {...getInputProps()} />
                                        <span className="spanDropzone">{isDragAccept ? "📂" : "📁"}</span>
                                        <p className="dropText">Drag'n'drop images, or click to select files</p>
                                    </div>
                                    );
                                }}
                                </Dropzone>
                                <p id="pCreate">Archivo añadido:</p>
                                <ul>
                                <li className="dropText">{fileAudio ? fileAudio.name : ' '}</li>
                                </ul>
                            </div>
                            
                        </div>
    
                        <button className="buttonCreate" type="button" id="submitCreate" onClick={handleFinish}>Finalizar</button>
    
                    </div>
    
                </div>
            </div>
        )
    }
    
    // console.log(fileNames);
}

export default CreateResume;