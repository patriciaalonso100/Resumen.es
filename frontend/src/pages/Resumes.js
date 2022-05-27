import React from 'react';
import '../css/showresume.scss';
import {Row, Col, Container} from 'styled-bootstrap-grid';
import { useLocation } from 'react-router-dom';
import { useEffect} from 'react';
import StarRating from '../components/starRating';
import { useContext } from "react";
import { UserContext } from "../UserContext";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


/**
 * Página de visualización de un resumen
 * @returns {any}
 */
const Resumes = () => {
  // Handle user
  const {user, setUser} = useContext(UserContext);

  // Handle navigate
  const navigate = useNavigate();

  /**
   * Gestión del cambio de viñetas entre la información y las descargas de un resumen
   */
  var Tabs = (function() {
    var s;
    return {
      settings: {
        tabs: document.getElementsByClassName('tabs__item'),
        tab: document.getElementsByClassName('tab')
      },
  
      init: function() {
        s = this.settings;
        this.display();
        this.click();
      },
  
      display: function() {
        if (s.tab.length) {
          [].forEach.call(s.tab, function(tab) {
            tab.style.display = 'none';
          });
          s.tab[0].style.display = 'block';
          s.tab[0].classList.add('active');
          s.tabs[0].classList.add('active');
        }
      },
  
      click: function() {
        if (s.tabs.length) {
          var currentIdx = 0,
              prevIdx = currentIdx;
  
          [].forEach.call(s.tabs, function(tab, idx) {
            tab.addEventListener('click', function() {
              prevIdx = currentIdx;
              currentIdx = idx;
  
              if (prevIdx !== currentIdx) {
                s.tab[prevIdx].style.display = 'none';
                s.tab[prevIdx].classList.remove('active');
                s.tabs[prevIdx].classList.remove('active');
                s.tab[currentIdx].style.display = 'block';
                s.tab[currentIdx].classList.add('active');
                s.tabs[currentIdx].classList.add('active');
              }
            });
          });
        }
      }
  
    }
  })();
  
  useEffect(() => {
    Tabs.init();
  }, []);


  const location = useLocation();
  const {stateProps} = location.state;

  let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
    }
  }; 

  /**
   * Función que permite realizar valoraciones
   * @param {*} value 
   */
  const sendRating = async (value) => {
    var postData = {
      rating: value,
      user: {id: user.id},
      resume: {resumeID: stateProps.resumeID}
    }; 

    /**
     * Petición axios que guarda una nueva valoración
     */
    await axios.post('http://localhost:8080/api/valoracion/post', postData, axiosConfig)
    .then ( _ =>{
      Swal.fire({
        title: 'Valoración establecida con éxito.',
        text: 'Gracias por su colaboración.',
        icon: 'success'
      });
    }).catch(async err => {
        if(err.response.status === 500){
          /**
           * Petición axios que permite actualizar una valoración ya realizada
           * Cada usuario puede valorar una única vez cada resumen, pero puede actualizar el valor de la misma
           */
          await axios.put('http://localhost:8080/api/valoracion/put', postData, axiosConfig)
          .then ( _ =>{
            Swal.fire({
              title: 'Valoración actualizada con éxito.',
              text: 'Gracias por su colaboración.',
              icon: 'success'
            });
          }).catch(err => {
            console.log(err);
          })
        }
    })

  }

  /**
   * Función que permite la verificación de los resúmenes
   */
  const showAlerts = async () => {
    /**
     * Alerta para la verificación de un resumen
     */
    Swal.fire({
      title: '¿Deseas verificar el resumen?',
      text: "Si no está seguro pulse cancelar. Esta operación no es reversible.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Verificar',
      confirmButtonColor: '#7FE54C',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      allowOutsideClick: false
    }).then(async (result) => {
      if (result.isConfirmed) {
        /**
         * Petición axios que actualiza el estado de un resumen a verificado
         */
        await axios({
          method: 'PUT',
          url: `http://localhost:8080/api/resumen/verified?resume_id=${stateProps.resumeID}`
        })
        .then ( _ => {
          Swal.fire(
            '¡Verificado con exito!',
            'El resumen ha sido verificado. Gracias por su colaboración.',
            'success'
          ).then(() => {
            /**
             * Si el resumen ha sido verificado con éxito se ofrece la posibilidad de catalogarlo como premium 
             */
            Swal.fire({
              title: '¿Deseas hacer premium este resumen?',
              text: "Esta operación no es reversible.",
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Sí',
              confirmButtonColor: '#7FE54C',
              cancelButtonColor: '#EC4C33',
              cancelButtonText: 'No',
              reverseButtons: true,
              allowOutsideClick: false
            }).then(async (result) => {
              if (result.isConfirmed) {
                /**
                 * Petición axios que actualiza el estado de un resumen a premium
                 */
                await axios({
                  method: 'PUT',
                  url: `http://localhost:8080/api/resumen/premium?resume_id=${stateProps.resumeID}`
                }).then ( _ => {
                  Swal.fire(
                    'Resumen designado como premium.',
                    'Gracias por su colaboración.',
                    'success'
                  ).then(() => navigate('/'));
                }).catch(err => {console.log(err)});
              } else if (
                result.dismiss === Swal.DismissReason.cancel
              ) {
                Swal.fire(
                  'Resumen designado como gratuito.',
                  'Gracias por su colaboración.',
                  'success'
                ).then(() => navigate('/'));
              }
            })
          })
        }).catch(err => {console.log(err)});
      } else if (
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

  
  return(
        <Container className='show__resume__container'>
        {stateProps ?
          <Row row className="row__resume__container">
              <Col col alignSelf='center' md="3" style={{marginRight:"15px"}}>
                <img className="img__container__resume" src={stateProps.coverPage ? "data:image/jpg;base64," + stateProps.coverPage : "https://www.giulianisgrupo.com/wp-content/uploads/2018/05/nodisponible.png"}
                  style={{boxShadow:"2px 2px 5px 5px rgba(0, 0, 0, 0.8)"}}/>
              </Col>
              <Col col alignSelf='center' md="8">
                  <div className='resume__container'>
                    <header className='resume__header'>
                        <ul className="tabs">
                          <li className="tabs__item">Información</li>
                          <li className="tabs__item">Descargas</li>
                        </ul>
                    </header>
                    <div className="content-tabs">
                      <div className="tab">
                        {( user.expert )
                        ? 
                          !stateProps.verified ? 
                            <div>
                              <button onClick={showAlerts} className='btn__gestionar'>GESTIONAR RESUMEN</button>
                            </div> 
                            : <div></div>
                        : 
                        <div></div>
                        }
                        <h2 className="preview__header">{stateProps.bookTitle}</h2>
                        <h4>Extracto:</h4>
                        <p className="preview__excerpt">{stateProps.resumeText}</p>
                        <h2 className="card__header">{stateProps.authorName}</h2>
                        <p className="card__count">{stateProps.publisher}</p>
                      </div>


                      <div className="tab" style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", margin:"0 auto"}}>
                          <a download={stateProps.bookTitle+".pdf"} href={"data:application/pdf;base64," + stateProps.resume} style={{marginRight: '5px'}}>
                            <button className='btn__gestionar'> DOWNLOAD PDF </button>
                          </a>
                          <a download={stateProps.bookTitle+".mp3"} href={"data:audio/mp3;base64," + stateProps.audio}>
                            <button className='btn__gestionar'> DOWNLOAD AUDIO </button>
                          </a>
                          </div>
                        { !user.expert ? 
                          <div style={{display: "flex", flexDirection: "row", paddingBottom: "1em", alignItems: "center", justifyContent: "center", margin:"0 auto"}}>
                            <span className="preview__date" style={{paddingRight: "0.5em"}}>Valorar: </span>
                            <StarRating sendRating={sendRating}/>
                          </div>
                          : <div></div>
                        }
                      </div>
                    </div>
                  </div>
              </Col>
          </Row>
        : <div></div>}
      </Container>
  )
}

export default Resumes;