import React from 'react';
import '../css/home.css';
import  {useState, useEffect} from 'react';
import axios from "axios";
import Board from '../components/board';
import Searchbar from '../components/searchbar';
import { useContext } from "react";
import { UserContext } from "../UserContext";
import Swal from 'sweetalert2';

/**
 * Página de inicio de la aplicación, muestra todos los resúmenes verificados
 * @returns {any}
 */
const Home = (props) => {
    /**
     * Define variables
     */
    const [resumesArray, setResumes] = useState([]);
    
    const [show, setShow] = useState(props.show);

    /**
     * Estados para la barra de búsqueda
     */
    const [busqueda, setBusqueda] = useState("");
    const [filtrados, setFiltrados] = useState([]);
    const [found, setFound] = useState(false);

    /**
     * Booleans para la barra de búsqueda
     */
    const [fActive, setFActive] = useState(false);
    const [searchByTitle, setSearchByTitle] = useState(false);
    const [searchByAuthor, setSearchByAuthor] = useState(false);
    const [searchByPublisher, setSearchByPublisher] = useState(false);

    const {user, setUser} = useContext(UserContext);

    // Handle navigate
    // const navigate = useNavigate();


    /**
     * Función que obtiene los resúmenes de la base de datos
     */
    const consultaAPI = async () => {

        /**
         * Aparece un mensjae Swal durante el tiempo de carga de los resúmenes
         */
        const swal = Swal.fire({
            title: 'Obteniendo resúmenes...',
            text: 'Espere un momento porfavor.',
            icon: 'info',
            timer: 1000,
            showCancelButton: false,
            showCloseButton: false,
            showConfirmButton: false,
            allowOutsideClick: false
        })

        /**
         * Petición axios para la llamada a la API que obtiene los resúmenes verificados
         */
        await axios({
        method: 'GET',
        url: 'http://localhost:8080/api/resumen/verificado'
        }).then(async res => {
            var aux = [];
            if (res.data.length == 0 || res.data == []) {
                swal.close();
                Swal.fire({
                    title: 'No hay resúmenes disponibles',
                    text: '¡Empiece a crear!',
                    icon: 'info'
                })
            }
            res.data.map(async data => { 

                /**
                 * Patición axios que obtiene la valoración de los resúmenes
                 */
                await axios({
                    method: 'GET',
                    url: `http://localhost:8080/api/valoracionmedia?resume_id=${data.resumeID}`
                }).then(res2 => {
                    data.avgRating = res2.data;
                    aux.push(data);
                    setResumes([...aux]);
                    setFiltrados([...aux]);
                    swal.close();
                    console.log(aux);
                }).catch(_ => {
                    setResumes(res.data);
                    setFiltrados(res.data);
                })
            });
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
     * Función para activar y desactivar los filtros
     */
    const filterActive = () => {
        setFActive(!fActive);
    }

    const filterInactive = () => {
        setFActive(false);
        setFiltrados(resumesArray);
        document.getElementById("inputSearch").value = "";
    }

    const filterTitle = () => {
        setSearchByTitle(true);
        setSearchByAuthor(false);
        setSearchByPublisher(false);
    }

    const filterAuthor = () => {
        setSearchByAuthor(true);
        searchByAuthor(false);
        setSearchByTitle(false);
    }

    const filterPublisher = () => {
        setSearchByPublisher(true);
        setSearchByTitle(false);
        setSearchByAuthor(false);
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
            <Board resumesArray={resumesArray} filtrados={filtrados} show={show} setShow={setShow}/>
        </div>
    )
}

export default Home;