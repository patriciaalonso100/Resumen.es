import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/home.css';
import {FaStar} from 'react-icons/fa';
import { useContext } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

/**
 * Tarjeta para la visualización de los resúmenes en las páginas de home, verify y favourites
 * @param {any} props
 * @returns {any}
 */
function Tarjeta(props) {

    const {user, setUser} = useContext(UserContext);
    const navigate = useNavigate();

    /**
     * Función para bloquear resúmenes premium a usuarios no premium
     * Lanza mensajes Swal para alertar de que los resúmenes no están disponibles a usuario estándar, o no registrado,
     * y permite al usuario la redirección a la página de Profile o Register, dónde podrá cambiar su tipo de cuenta o 
     * crear una nueva
     */
    const blockResume = () => {
        if(props.show === false){
            console.log("show2: "+props.show);
            Swal.fire({
                title: 'No está registrado.',
                text: 'Lo siento, no tiene acceso a este resumen',
                icon: 'error',
                showCancelButton: true,
                confirmButtonText: 'Inicie sesión',
                showConfirmButton: true,
                allowOutsideClick: false
            }).then(async (result) => {
                if (result.isConfirmed) {
                    navigate('/login')
                }else if (
                    result.dismiss === Swal.DismissReason.cancel
                  ) {
                    Swal.fire(
                      'Cancelado',
                      'Se ha cancelado la operación.',
                      'error'
                    )
                }
            })
        }else{
            Swal.fire({
                title: 'Resumen del plan premium.',
                text: 'Lo siento, no tiene acceso a este resumen',
                icon: 'error',
                showCancelButton: true,
                confirmButtonText: 'Hazte Premium',
                showConfirmButton: true,
                allowOutsideClick: false
            }).then(async (result) => {
                if (result.isConfirmed) {
                    navigate('/profilepage')
                }else if (
                    result.dismiss === Swal.DismissReason.cancel
                  ) {
                    Swal.fire(
                      'Cancelado',
                      'Se ha cancelado la operación.',
                      'error'
                    )
                }
            })
        }
        
    }

    return(
        <div className="main-card">
        <section className="card-area">
            <section className="card-section">
                <div className="card">
                    <div className="flip-card">
                        <div className="flip-card__container">
                            <div className="card-front">
                                <div className="card-front__tp">
                                    <h2 className="card-front__heading">
                                        {props.bookTitle}
                                    </h2>
                                    {(props.avgRating && !isNaN(props.avgRating))
                                    ?
                                    <div style={{display: "flex", alignItems: "flex-start", textAlign: "start", justifyContent: "center"}}>
                                        <p className="card-front__text" style={{paddingRight: '0.5em', paddingTop:'0.1rem'}}>
                                            {props.avgRating}
                                        </p>
                                        <FaStar 
                                            color="#F7CE3E" 
                                            size={10}
                                        />
                                    </div>
                                    :
                                    <p className="card-front__text">
                                        Valoración no disponible
                                    </p>
                                    }                                    
                                </div>
                                <div className="card-front__bt">
                                    <p className="card-front__text-view">
                                        Ver detalles
                                    </p>
                                </div>
                            </div>
                            <div className="card-back">
                                <img className="img__container" src={props.coverPage ? "data:image/jpg;base64," + props.coverPage : "https://www.giulianisgrupo.com/wp-content/uploads/2018/05/nodisponible.png"}/>
                            </div>
                        </div>
                    </div>

                    <div className="inside-page">
                        <div className="inside-page__container">
                            <h3 className="inside-page__heading inside-page__heading">
                                {props.authorName}
                            </h3>
                            <p className="inside-page__text">
                                <textarea rows="4" defaultValue={props.resumeText}/>
                            </p>
                            {props.show ?
                                user.expert ?
                                    <NavLink className="inside-page__btn" 
                                    to="/resume" 
                                    state={{
                                        stateProps: props
                                    }}>
                                    Ver resumen
                                    </NavLink>
                                : (props.premium && !user.premium) ?
                                    <button className="inside-page__btn" onClick={blockResume}>Ver resumen</button>
                                : 
                                    <NavLink className="inside-page__btn" 
                                        to="/resume" 
                                        state={{
                                            stateProps: props
                                        }}>
                                        Ver resumen
                                    </NavLink>
                                : <button className="inside-page__btn" onClick={blockResume}>Ver resumen</button>
                            }
                        </div>
                    </div>
                </div>
            </section>
        </section>
    </div>
    )
}

export default Tarjeta;