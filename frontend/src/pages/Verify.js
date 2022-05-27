import React from 'react';
import '../css/verify.css';
import  {useState, useEffect} from 'react';
import axios from "axios";
import Board from '../components/board';
import Searchbar from '../components/searchbar';

const Verify = (props) => {

    const [resumesArray, setResumes] = useState([]);
    const [show, setShow] = useState(props.show);

    /**
     * Estados para la barra de búsqueda
     */
    const [busqueda, setBusqueda] = useState("");
    const [filtrados, setFiltrados] = useState([]);
    const [found, setFound] = useState(false);

    /**
     * Booleans para activar los filtros
     */
    const [fActive, setFActive] = useState(false);
    const [searchByTitle, setSearchByTitle] = useState(false);
    const [searchByAuthor, setSearchByAuthor] = useState(false);
    const [searchByPublisher, setSearchByPublisher] = useState(false);

    /**
     * Función que obtiene los resúmenes por verificar
     */
    const consultaAPI = async () => {
        /**
         * Petición axios para obtener los resúmenes pendientes de verificación
         */
        await axios({
        method: 'GET',
        url: 'http://localhost:8080/api/resumen/noverificado'
        }).then(async res => {
            setResumes(res.data);
            setFiltrados(res.data);
            console.log('old data', resumesArray);
            
            for(let i=0; i<resumesArray.length; i++) {
                await axios({
                    method: 'GET',
                    url: `http://localhost:8080/api/valoracionmedia?resume_id=${resumesArray[i].resumeID}`
                }).then(res2 => {
                    console.log('received', res2.data)
                    let newJSON = {...res.data, avgRating: res2.data}
                    setResumes(newJSON);
                    setFiltrados(newJSON);
                    console.log('new data', resumesArray);
                }).catch(err => console.log(err))
            }
        }).catch(err => console.log(err))
    }

    /**
     * Función que obtiene el valor de la búsqueda introducida en la barra de búsqueda
     */
    function handleChange() {
        let mySearch = document.getElementById("inputSearch").value;
        setBusqueda(mySearch);
        search(mySearch);
    }

    /**
     * Función para resetear la barra de búsqueda tras finalizar una búsqueda
     */
    const resetSearch = () => {
        let searchresultBtn = document.getElementById("inputSearch").value;

        var searchresult2 = resumesArray.filter((aux) => {
            if(aux.bookTitle.toString().toLowerCase().includes(searchresultBtn.toLowerCase())){
                setFound(true);
                return aux;
            }
        });
        console.log('found', found);
        if (!found){
            setFiltrados(resumesArray);
            document.getElementById("inputSearch").value = "";
        } else {
            setFiltrados(searchresult2);
            document.getElementById("inputSearch").value = "";
        }
        setFound(false);
    }

    /**
     * Función que realiza el filtrado de las búsquedas
     * @param {*} searchInput 
     */
    const search = (searchInput) => {
        if(searchByTitle){
            var searchresult = resumesArray.filter((aux) => {
                if(aux.bookTitle.toString().toLowerCase().includes(searchInput.toLowerCase())){
                    return aux;
                }
            });
        }else if(searchByAuthor){
            var searchresult = resumesArray.filter((aux) => {
                if(aux.authorName.toString().toLowerCase().includes(searchInput.toLowerCase())){
                    return aux;
                }
            });
        }else if(searchByPublisher){
            var searchresult = resumesArray.filter((aux) => {
                if(aux.publisher.toString().toLowerCase().includes(searchInput.toLowerCase())){
                    return aux;
                }
            });
        }
        else{
            var searchresult = resumesArray.filter((aux) => {
                if(aux.bookTitle.toString().toLowerCase().includes(searchInput.toLowerCase()) || aux.authorName.toString().toLowerCase().includes(searchInput.toLowerCase()) ||aux.publisher.toString().toLowerCase().includes(searchInput.toLowerCase())){
                    return aux;
                }
            });
        }
        setFiltrados(searchresult);
    }

    /**
     * Función para activar y desactivar los filtros
     */
    const filterActive = () => {
        setFActive(true);
    }

    const filterInactive = () => {
        setFActive(false);
        setFiltrados(resumesArray);
        document.getElementById("inputSearch").value = "";
    }

    const filterTitle = () => {
        setSearchByTitle(true);

    }

    const filterAuthor = () => {
        setSearchByAuthor(true);
    }

    const filterPublisher = () => {
        setSearchByPublisher(true);

    }

    const filterAll = () => {
        setSearchByAuthor(false);
        setSearchByTitle(false);
        setSearchByPublisher(false);
        setFiltrados(resumesArray);
        document.getElementById("inputSearch").value = "";
    }

    useEffect(() => {
        consultaAPI();
    }, []);

    return(
        <div>
            <Searchbar handleChange={handleChange} resetSearch={resetSearch} filterActive={filterActive} 
            filterInactive={filterInactive} fActive={fActive} filterTitle={filterTitle} filterAuthor={filterAuthor} 
            filterPublisher={filterPublisher} filterAll={filterAll}/>
            <div className='contVerify'>
                <p id="pVerify">Resúmenes por verificar</p>
                <Board resumesArray={resumesArray} filtrados={filtrados} show={show} setShow={setShow}/>
            </div>
        </div>
    )
}

export default Verify;