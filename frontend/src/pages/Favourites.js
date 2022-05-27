import React, { useContext } from "react";
import  {useState, useLayoutEffect, useEffect} from 'react';
import '../css/favourites.css';
import axios from "axios";
import { UserContext } from "../UserContext";
import Board from '../components/board';


/**
 * Página en la que se visualiza la lista de resúmenes creados por un usuario
 * @returns {any}
 */
const Favourites = () => {

    /**
     * Estados
     */
    const {user, setUser} = useContext(UserContext);

    const [resumesArray, setResumes] = useState([]);
    const [filtrados, setFiltrados] = useState([]);

    /**
     * Uso de una petición axios para hacer la llamada a la API y obtener los resúmenes creados por un usuario
     */
    const consultaAPI = async () => {
        await axios({
        method: 'GET',
        url: `http://localhost:8080/api/resumen/usuario?user_id=${user.id}`
        }).then(async res => {
            setResumes(res.data);
            setFiltrados(res.data);
            
            for(let i=0; i<resumesArray.length; i++) {
                await axios({
                    method: 'GET',
                    url: `http://localhost:8080/api/valoracionmedia?resume_id=${resumesArray[i].resumeID}`
                }).then(res2 => {
                    console.log('received', res2.data)
                    let newJSON = {...res.data, avgRating: res2.data}
                    setResumes(newJSON);
                    setFiltrados(newJSON);
                }).catch(err => console.log(err))
            }
        }).catch(err => console.log(err))
    }

    useEffect(() => {
        consultaAPI();
    }, []);

    return(

            <div className="contFavourites">
                <p  id="textoFavourites">Sus resúmenes</p>
                <Board resumesArray={resumesArray} filtrados={filtrados}/>
            </div>
    )
}

export default Favourites;