import React, { useContext } from "react";
import  {useState, useLayoutEffect, useEffect} from 'react';
import '../css/profile.css';
import axios from "axios";
import { UserContext } from "../UserContext";
import ProfilePicture from "../res/defaultProfile.jpg";
import ButtonImage from "../res/editButton.png";
import Switch from 'react-input-switch';
import Swal from 'sweetalert2';

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


/**
 * Página para la gestión del perfil del usuario
 * @returns {any}
 */
const Profile = () => {

    const {user, setUser} = useContext(UserContext);
    const [editName, setEditName] = useState(false);
    const [value, setValue] = useState('no');

    /**
     * Gestiona el cambio de tamaño de la pantalla
     */
    const [width, _height] = useWindowSize();

    /**
     * Funciones para activar la edición del perfil
     */
    const editProfileName = () => {
        setEditName(true);
    }

    /**
     * Función que finaliza la edición del perfil
     */
    const finishEdition = () => {

        handleProfileEditName();
        handleProfileEditSurname();

        setEditName(false);
        
        Swal.fire({
            title: 'Se han actualizado sus datos con éxito.',
            text: '¡Gracias!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            allowOutsideClick: false
        })
    }

    /**
     * Función que gestiona las acciones del toggle
     */
    const handleChangeSwitch = async() => {
        await axios({
            method: 'PUT',
            url: `http://localhost:8080/api/usuario/premium?user_id=${user.id}&premium=${!user.premium}`
            }).then(res => {
                    setUser(res.data);
                    res.data.premium ? setValue('yes') : setValue('no');
                    if(res.data.premium){
                        /**
                         * Si el usuario cambia del plan estándar al premium, aparece un mensaje Swal para permitir que 
                         * introduzca sus datos bancarios y complete la mejora de su tipo de cuenta
                         */
                        const { } = Swal.fire({
                            title: '¡Bienvenido al plan premium!',
                            text: "Introduzca sus datos bancarios para completar la operación.",
                            icon: 'question',
                            inputPlaceholder: 'Introduzca su iban',
                            input: 'text',
                            showCancelButton: true,
                            confirmButtonText: 'Confirmar',
                            confirmButtonColor: '#7FE54C',
                            cancelButtonText: 'Cancelar',
                            reverseButtons: true,
                            allowOutsideClick: false,
                            inputValidator: async (value) => {
                              if (!value) {
                                return 'Por favor introduce un IBAN.'
                              }else{
                                /**
                                 * Si la respuesta del  mensaje Swal es correcta, se realiza una petición axios a la API para actualizar los datos
                                 */
                                await axios({
                                    method: 'PUT',
                                    url: `http://localhost:8080/api/usuario/iban?user_id=${user.id}&iban=${value}`
                                })
                                .then ( _ => {
                                    Swal.fire(
                                    '¡Datos introducidos con éxito!',
                                    'Ya tiene acceso al contenido premium. Gracias por su colaboración.',
                                    'success'
                                    )
                                }).catch(err => {console.log(err)}); 
                              }
                            }
                        }).then(async (result) => {
                             if ( result.dismiss === Swal.DismissReason.cancel ) {   
                                 /**
                                  * Si finalmente el usuario decide no cambiar su tipo de cuenta, se vuelve al estado inicial
                                  */
                                await axios({
                                    method: 'PUT',
                                    url: `http://localhost:8080/api/usuario/premium?user_id=${user.id}&premium=false`
                                    }).then(res => {
                                        setUser(res.data);  
                                        res.data.premium ? setValue('yes') : setValue('no');
                                    }).catch(err => {
                                        console.log(err)
                                    })     
                            }                                          
                        }).catch(err => {console.log(err)});
                    }else{
                        /**
                         * Si el usuario quiere cambiar su cuenta de Premium a Estándar se muestra un mensaje Swal para confirmar la decisión
                         */
                        Swal.fire({
                            title: '¿Quiere dejar de ser un usuario premium?',
                            text: "Perderá el acceso a contenido exclusivo.",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Confirmar',
                            confirmButtonColor: '#7FE54C',
                            cancelButtonText: 'Cancelar',
                            reverseButtons: true,
                            allowOutsideClick: false
                        }).then(async (result) => {

                            if (result.isConfirmed) {
                            /**
                             * Si el usuario confirma su decisión se realiza una petición axios para eliminar sus datos bancarios de la base de datos
                             */
                                await axios({
                                    method: 'PUT',
                                    url: `http://localhost:8080/api/usuario/iban?user_id=${user.id}&iban=null`
                                })
                                .then ( _ => {
                                    Swal.fire(
                                    '¡Sus datos bancarios han sido eliminados!',
                                    'Si desea volver al plan premium deberá introducirlos de nuevo.',
                                    'success'
                                    )
                                }).catch(err => {console.log(err)});
                            } else if ( result.dismiss === Swal.DismissReason.cancel ) { 
                                 /**
                                  * Si finalmente el usuario decide no cambiar su tipo de cuenta, se vuelve al estado inicial
                                  */                                 
                            await axios({
                                method: 'PUT',
                                url: `http://localhost:8080/api/usuario/premium?user_id=${user.id}&premium=true`
                                }).then(res => {
                                    setUser(res.data);  
                                    res.data.premium ? setValue('yes') : setValue('no');
                                }).catch(err => {
                                    console.log(err);
                                })
                            }       
                        }).catch(err => {console.log(err)});
                    }
                }).catch(err => {
                console.log(err)
            }) 
    }

    /**
     * Función para la edición del nombre del perfil
     */
    const handleProfileEditName = async() => {
        let inputNameEdit = document.getElementById("inputName") ? document.getElementById("inputName").value : "";

        if (inputNameEdit == ""){
            inputNameEdit = user.name;
        }
        
        await axios({
            method: 'PUT',
            url: `http://localhost:8080/api/usuario/nombre?name=${inputNameEdit}&user_id=${user.id}`
            }).then(res => {
                setUser(res.data);
                console.log('user', user);
                console.log('resdata', res.data);
            }).catch(err => {
                console.log(err)
            })        
    }

    /**
     * Función para la edición del apellido del perfil
     */
    const handleProfileEditSurname = async() => {
        let inputSurnameEdit = document.getElementById("inputSurname") ? document.getElementById("inputSurname").value : "";
        
        if (inputSurnameEdit == ""){
            inputSurnameEdit = user.surname;
        }
       
        await axios({
            method: 'PUT',
            url: `http://localhost:8080/api/usuario/apellido?surname=${inputSurnameEdit}&user_id=${user.id}`
            }).then(res => {
                setUser(res.data);
            }).catch(err => {
                console.log(err)
            })   
    }

    useEffect(() => {
        user.premium ? setValue('yes') : setValue('no');
    }, []);

if(width<768){
    return(
        <div className="contAll">
        <div  className="contImgProfile">
            <img className="imgProfile" src={ProfilePicture} />
        </div>
        <div className="contProfile">
        <div className="formProfile">
                    {editName ?
                    <label id="labelProfilePwd">
                        <span id="pwdText">Nombre</span><input id="inputName" type="text" placeholder={user.name}/>
                        <span id="pwdText">Apellido</span><input id="inputSurname" type="text" placeholder={user.surname}/>
                    </label> :
                    <label id="labelProfile">  
                        <p className="alignItems"><span className="textoProfile">{user.name} {user.surname}</span><button className="editButton" onClick={editProfileName}><img className="imageEditButton" src={ButtonImage} /></button></p>
                    </label> 
                    }

                    <label id="labelProfile">
                        <span className="textoProfile">{user.email}</span>
                    </label>
                    <label id="labelPremium">
                        <p className="textoProfile"><span id="pwdText">Tipo de Cuenta:</span> {user.expert ? <span className="textoProfile">Experto</span> : user.premium ? <span className="textoProfile">Premium</span> : <span className="textoProfile">Estándar</span>}
                        {user.isExpert ? <div></div> : <Switch on="yes" off="no" id="togglePremiun" value={value} onChange={handleChangeSwitch} />}
                        </p>
                    </label>
                    <label id="labelProfile">
                        <span id="pwdText">Retribución acumulada: {user.accRetribution}</span>
                    </label>
                    {editName ? <button className="editButtonFinish" onClick={finishEdition}>Finalizar Edición</button> : <div></div>}
                </div>
        </div>
        </div>
    )
}else{
    return(
        <div className="contAll">
        <div  className="contImgProfile">
            <img className="imgProfile" src={ProfilePicture} />
        </div>
        <div className="contProfile">
                <div className="formProfile">
                    {editName ?
                    <label id="labelProfilePwd">
                        <span id="pwdText">Nombre</span><input id="inputName" type="text" placeholder={user.name}/>
                        <span id="pwdText">Apellido</span><input id="inputSurname" type="text" placeholder={user.surname}/>
                    </label> :
                    <label id="labelProfile">  
                        <p className="alignItems"><span className="textoProfile">{user.name} {user.surname}</span><button className="editButton" onClick={editProfileName}><img className="imageEditButton" src={ButtonImage} /></button></p>
                    </label> 
                    }

                    <label id="labelProfile">
                        <span className="textoProfile">{user.email}</span>
                    </label>
                    <label id="labelPremium">
                        <p className="textoProfile"><span id="pwdText">Tipo de Cuenta:</span> {user.expert ? <span className="textoProfile">Experto</span> : user.premium ? <span className="textoProfile">Premium</span> : <span className="textoProfile">Estándar</span>}
                        {user.isExpert ? <div></div> : <Switch on="yes" off="no" id="togglePremiun" value={value} onChange={handleChangeSwitch} />}
                        </p>
                    </label>
                    <label id="labelProfile">
                        <span id="pwdText">Retribución acumulada: {user.accRetribution}</span>
                    </label>
                    {editName ? <button className="editButtonFinish" onClick={finishEdition}>Finalizar Edición</button> : <div></div>}
                </div>
        </div>
        </div>
    )}

}

export default Profile;