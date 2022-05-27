import React from "react";
import  {useState, useLayoutEffect} from 'react';
import '../css/register.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { UserContext } from "../UserContext";
import validator from 'validator';
import Swal from 'sweetalert2';
import { FaTheRedYeti } from "react-icons/fa";

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
 * Página para el registro de un nuevo usuario 
 * @param {any} props
 * @returns {any}
 */
const Register = (props) => {
    /**
     * Boolean para la aparición del div de los datos bancarios
     */
    const [payment, setPayment] = useState(false);
    const [finishRegister, setFinishRegister] = useState(false);

    const paying = () => {
        setPayment(true);
    }

    /**
     * Estados y función para la comprobación del correo electrónico
     */
    const [emailError, setEmailError] = useState('')
    const [color, setColor] = useState(true);
    const validateEmail = (e) => {
      var email = e.target.value
    
      if (validator.isEmail(email)) {
        setEmailError('Email válido')
        setColor(false)
      } else {
        setEmailError('El email introducido no es válido')
        setColor(true)
      }
    }

    /**
     * Estados y función para la comprobación de las contraseñas
     */
    const[equalsGreen, setEqualsGreen] = useState(false);
    const[equalsRed, setEqualsRed] = useState(false);

    function equalPasswords (){
        let passInput = document.getElementById("inputRegisterPass").value;
        let passInput2 = document.getElementById("inputRegisterPass2").value;

        if(passInput === passInput2){
            setEqualsGreen(true);
        }if (passInput !== passInput2) {
            setEqualsRed(true);
            setEqualsGreen(false);
        }if (passInput2 === '') {
            setEqualsRed(false);
        }
    }

    /**
     * Función para la comprobación del formato del IBAN
     * @param {*} iban 
     * @returns 
     */
    const validateIBAN = (iban) => {
        var IBAN = iban.toUpperCase();
        IBAN = IBAN.trim();
        IBAN = IBAN.replace(/\s/g, ""); //Avoid spaces

        // Check number of chars
        if (IBAN.length != 24) {
            return false;
        }

        // Take first two letters: ES
        const letra1 = IBAN.substring(0, 1);
        const letra2 = IBAN.substring(1, 2);
        const num1 = getnumIBAN(letra1);
        const num2 = getnumIBAN(letra2);
        // Letters -> Numbers
        var chain = String(num1) + String(num2) + IBAN.substring(2);
        // Move first 6 digits to the end of the chain
        chain = chain.substring(6) + chain.substring(0,6);

        // Calculate remainer
        const remainer = modulo97(chain);
        if (remainer == 1) {
            return true;
        } else {
            return false;
        }
    }

    function modulo97(iban) {
        var parts = Math.ceil(iban.length/7);
        var remainer = "";
    
        for (var i = 1; i <= parts; i++) {
            remainer = String(parseFloat(remainer+iban.substr((i-1)*7, 7))%97);
        }
    
        return remainer;
    }
    
    function getnumIBAN(letra) {
        var ls_letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return ls_letras.search(letra) + 10;
    }

    const navigate = useNavigate();
    const {user, setUser} = useContext(UserContext);

    const finish = () => {
        setFinishRegister(true);
    }

    /**
     * Función para finalizar el registro de un usario
     * @param {*} isPremium 
     */
    const handleFinish = async (isPremium) => {

        /**
         * Obtenemos los valores de los inputs del formulario
         */
        // let emailInput = document.getElementById("inputRegisterEmail").value;
        let nameInput = document.getElementById("inputRegisterName").value;
        let surnameInput = document.getElementById("inputRegisterSurname").value;
        let IBANInput;
        if(payment){
            IBANInput = document.getElementById("inputRegisterIBAN").value 
        } else {
            IBANInput = null;
        }
        if (equalsGreen && color===false){
            let passInput = document.getElementById("inputRegisterPass").value;
            let emailInput = document.getElementById("inputRegisterEmail").value;
            
        let postData = {
            email: emailInput,
            name: nameInput,
            surname: surnameInput,
            premium: isPremium,
            expert: false,
            iban: IBANInput ? (validateIBAN(IBANInput) ? IBANInput : null) : null,
            password: passInput
        };

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
          };      

        await axios.post('http://localhost:8080/api/auth/signup', postData, axiosConfig)
        .then ( async res =>{
            let postLoginData = {
                email: emailInput,
                password: passInput
            }
            await axios.post('http://localhost:8080/api/auth/signin', postLoginData, axiosConfig)
            .then ( async res =>{
                console.log(res.data);
                setUser(res.data);
                props.setShow(true);
                navigate('/');
            }).catch(err => {
                console.log(err)
                window.location.reload(false);
            })
        }).catch(err => {
            console.log(err)
            window.location.reload(false);
        })
        }else{
            Swal.fire({
                title: 'Los datos introducidos no son correctos.',
                text: 'Por favor revíselos y vuelva a intentarlo',
                icon: 'warning',
                timer: 2000,
                showConfirmButton: false,
                allowOutsideClick: false
            })
        }

    }

    /**
     * Gestiona el cambio de tamaño de la pantalla
     */
    const [width, _height] = useWindowSize();

    if (width<768){
        return(
            <div>
            <div className="contRegister_mobile">
                <div className="formRegister_mobile">
                    <h2 id="h2Register">Regístrese</h2>
                    <label id="labelRegister">
                        <span>Nombre</span>
                        <input id="inputRegisterName" type="text" placeholder="Introduzca su nombre"/>
                    </label>
                    <label id="labelRegister">
                        <span>Apellido</span>
                        <input id="inputRegisterSurname" type="text" placeholder="Introduzca su apellido"/>
                        <span id="emailOk"></span>
                    </label>
                    <label id="labelRegister">
                        <span>Correo electrónico</span>
                        <input id="inputRegisterEmail" type="email" placeholder="Introduzca su correo electrónico"/>
                        {color ? <span style={{color: "red",}}>{emailError}</span> : <span style={{color: "green",}}>{emailError}</span>}
                    </label>
                    <label id="labelRegister">
                        <span>Contraseña</span>
                        <input id="inputRegisterPass" type="password" placeholder="Introduzca su contraseña"/>
                    </label>
                    <label id="labelRegister">
                        <span>Repita la contraseña</span>
                        {equalsGreen ? <input id="inputRegisterPass2" type="password" onChange={equalPasswords} placeholder="Introduzca su contraseña" style={{backgroundColor: 'green'}}/>
                        : equalsRed ? <input id="inputRegisterPass2" type="password" onChange={equalPasswords} placeholder="Introduzca su contraseña" style={{backgroundColor: 'red'}}/> : 
                        <input id="inputRegisterPass2" type="password" onChange={equalPasswords} placeholder="Introduzca su contraseña"/>}
                    </label>
                    <p className="forgot-passRegister" id="pL">Por favor seleccione un plan</p>
                    <h1 id="h1Flecha" className="animated fadeInDown"><a href="#planes" className="icon icon-arrow-down"></a></h1>
                </div>
               
                <div className="snip1214_mobile" id="planes">
                    <div className="plan featured">
                        <h3 className="plan-title">
                        Estándar
                        </h3>
                        <div className="plan-cost"><span className="plan-price">Gratuito</span><span className="plan-type">/ Mes</span></div>
                        <ul className="plan-features">
                        <li><i className="ion-checkmark"> </i>Acceso a resúmenes gratuitos</li>
                        <li><i className="ion-checkmark"> </i>Creación de resúmenes</li>
                        <li><i className="ion-checkmark"> </i>Valoración de resúmenes</li>
                        </ul>
                        <button className="buttonPlan" id="planFree" type="button" onClick={() => finish()}><a href="#submitRegister">Select Plan</a></button>
                    </div>
                    <div className="plan featured">
                        <h3 className="plan-title">
                        Premium
                        </h3>
                        <div className="plan-cost"><span class="plan-price">$4,99</span><span className="plan-type">/ Mes</span></div>
                        <ul className="plan-features">
                        <li><i className="ion-checkmark"> </i>Acceso a resúmenes gratuitos</li>
                        <li><i className="ion-checkmark"> </i>Acceso a resúmenes premium</li>
                        <li><i className="ion-checkmark"> </i>Creación de resúmenes</li>
                        <li><i className="ion-checkmark"> </i>Valoración de resúmenes</li>
                        </ul>
                        <button className="buttonPlan" id="planPremiun" type="button" onClick={() => paying()}><a href="#payment">Select Plan</a></button>
                    </div>
                </div>

                {finishRegister ? 
                <button className="buttonRegister2" type="button" id="submitRegister" onClick={() => {handleFinish(false);}}>Finalizar registro</button> 
                : <div></div>}
                
                {payment ? 
                <div className="formRegister_mobile" id="payment">
                    <h2 id="h2Register">Introduzca sus datos bancarios</h2>
                    <label id="labelRegister">
                        <span>IBAN</span>
                        <input id="inputRegisterIBAN" type="text" placeholder="Introduzca su IBAN"/>
                    </label>
                    <button class="buttonRegister" type="button" id="submitRegister" onClick={() => {handleFinish(true);}}>Finalizar registro</button>
                </div>: <div></div>}
                </div>
            </div>
        )
    }else{
        return(
            <div>
            <div className="contRegister">
                <div className="formRegister">
                    <h2 id="h2Register">Regístrese</h2>
                    <label id="labelRegister">
                        <span>Nombre</span>
                        <input id="inputRegisterName" type="text" placeholder="Introduzca su nombre"/>
                    </label>
                    <label id="labelRegister">
                        <span>Apellido</span>
                        <input id="inputRegisterSurname" type="text" placeholder="Introduzca su apellido"/>
                    </label>
                    <label id="labelRegister">
                        <span>Correo electrónico</span>
                        <input id="inputRegisterEmail" type="email" onChange={(e) => validateEmail(e)} placeholder="Introduzca su correo electrónico"/>
                        {color ? <span style={{color: "red",}}>{emailError}</span> : <span style={{color: "green",}}>{emailError}</span>}
                    </label>
                    <label id="labelRegister">
                        <span>Contraseña</span>
                        <input id="inputRegisterPass" type="password" placeholder="Introduzca su contraseña"/>
                    </label>
                    <label id="labelRegister">
                        <span>Repita la contraseña</span>
                        {equalsGreen ? 
                        <input id="inputRegisterPass2" type="password" onChange={equalPasswords} placeholder="Introduzca su contraseña" style={{backgroundColor: 'green'}}/>
                        : equalsRed ? <input id="inputRegisterPass2" type="password" onChange={equalPasswords} placeholder="Introduzca su contraseña" style={{backgroundColor: 'red'}}/> : 
                        <input id="inputRegisterPass2" type="password" onChange={equalPasswords} placeholder="Introduzca su contraseña"/>}
                        {equalsGreen ? 
                        <span style={{color: "green",}}>Las contraseñas coinciden</span>
                        : equalsRed ? <span style={{color: "red",}}>Las contraseñas no coinciden</span> : <p></p>}
                    </label>
                    <p className="forgot-passRegister" id="pL">Por favor seleccione un plan</p>
                    <h1 id="h1Flecha" className="animated fadeInDown"><a href="#planes" className="icon icon-arrow-down"></a></h1>
                </div>
            
                <div className="snip1214" id="planes">
                    <div className="plan featured">
                        <h3 className="plan-title">
                        Estándar
                        </h3>
                        <div className="plan-cost"><span className="plan-price">Free</span><span className="plan-type">/ Mes</span></div>
                        <ul className="plan-features">
                        <li><i className="ion-checkmark"> </i>Acceso a resúmenes gratuitos</li>
                        <li><i className="ion-checkmark"> </i>Creación de resúmenes</li>
                        <li><i className="ion-checkmark"> </i>Valoración de resúmenes</li>
                        </ul>
                        <button className="buttonPlan" type="button" onClick={() => finish()}><a href="#submitRegister">Select Plan</a></button>
                    </div>
                    <div className="plan featured">
                        <h3 className="plan-title">
                        Premium
                        </h3>
                        <div className="plan-cost"><span class="plan-price">$4,99</span><span className="plan-type">/ Mes</span></div>
                        <ul className="plan-features">
                        <li><i className="ion-checkmark"> </i>Acceso a resúmenes gratuitos</li>
                        <li><i className="ion-checkmark"> </i>Acceso a resúmenes premium</li>
                        <li><i className="ion-checkmark"> </i>Creación de resúmenes</li>
                        <li><i className="ion-checkmark"> </i>Valoración de resúmenes</li>
                        </ul>
                        <button className="buttonPlan" type="button" onClick={() => paying()}><a href="#payment">Select Plan</a></button>
                    </div>
                </div>
                {/* <button className="buttonRegister2" type="button" id="submitRegister" onClick={() => paying()}>Regístrate</button> */}
                {finishRegister ? 
                <button className="buttonRegister2" type="button" id="submitRegister" onClick={() => {handleFinish(false);}}>Finalizar registro</button> 
                : <div></div>}
                {payment ? 
                <div className="formRegister" id="payment">
                    <h2 id="h2Register">Introduzca sus datos bancarios</h2>
                    <label id="labelRegister">
                        <span>IBAN</span>
                        <input id="inputRegisterIBAN" type="text"  onChange={(e) => validateIBAN(e)} placeholder="Introduzca su IBAN"/>
                    </label>
                    <button class="buttonRegister" type="button" id="submitRegister" onClick={() => {handleFinish(true);}}>Finalizar registro</button>
                </div> : <div></div>}
                </div>
            </div>
        )}
}

export default Register;