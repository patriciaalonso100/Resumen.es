import React, {useState, useLayoutEffect} from "react";
import { NavLink } from 'react-router-dom';
import '../css/login.css';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { UserContext } from "../UserContext";
import axios from "axios";
import Swal from 'sweetalert2';
import { defaultProps } from "react-input-switch";

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
 * Página de Login
 * @param {any} props
 * @returns {any}
 */
const Login = (props) => {
    
    const navigate = useNavigate();
    const {user, setUser} = useContext(UserContext);
    /**
     * Función para comprobar el login de los usuarios
     */
    const handleLogin = async() => {
        
        /**
         * Obtenemos el valor de los inputs del formulario
         */
        let userInput = document.getElementById("inputEmailLogin").value;
        let passInput = document.getElementById("inputPassLogin").value;

        let postLoginData = {
            email: userInput,
            password: passInput
        };

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
        };

        /**
         * Petición axios que llama a la API para comprobar los datos de usuario introducidos
         * Si los datos son correctos de redirige a la página de Home
         * Si los datos son incorrectos aparece un mensaje Swal advirtiendo del error
         */
        await axios.post('http://localhost:8080/api/auth/signin', postLoginData, axiosConfig)
        .then ( async res =>{
            console.log(res.data);
            setUser(res.data);
            props.setShow(true);
            navigate('/');
        }).catch(err => {
                    Swal.fire({
                        title: 'Credenciales no válidas',
                        text: 'Vuelva a intentarlo.',
                        icon: 'error'
                })
        })
    }

    /**
     * Gestiona el cambio de tamaño de la pantalla
     */
    const [width, _height] = useWindowSize();

    if (width<768) {
        return(
            <div className="cont__mobile">
                <div className="form__mobile">
                    <h2 id="h2L">Iniciar Sesión</h2>
                    <label id="labelL">
                        <span>Correo electrónico</span>
                        <input id="inputEmailLogin" className="inputL" type="email" placeholder="Email..."/>
                    </label>
                    <label id="labelL">
                        <span>Contraseña</span>
                        <input id="inputPassLogin" className="inputL" type="password" placeholder="Contraseña..."/>
                    </label>
                    <button className="buttonL" type="button" id="submit" onClick={handleLogin}>Inicia Sesión</button>
                    </div>
                    <div className="img__mobile">
                        <div className="content__img">
                            <div className="img__text">
                                <h2>¿Eres nuevo?</h2>
                                <p id="pL">Regístrese para descubrir nuestro catálogo y todas las oportunidades que esconde!</p>
                            </div>
                            <div>
                            <NavLink to="/register" className="buttonL2" id="img__btn">
                                Regístrate
                            </NavLink>
                            </div>
                        </div>
                    </div>
            </div>
        )
    } else {
        return(
            <div className="cont">
                <div className="form">
                    <h2 id="h2L">Iniciar Sesión</h2>
                    <label id="labelL">
                        <span>Correo electrónico</span>
                        <input id="inputEmailLogin" className="inputL" type="email" placeholder="Introduzca su correo electrónico"/>
                    </label>
                    <label id="labelL">
                        <span>Contraseña</span>
                        <input id="inputPassLogin" className="inputL" type="password" placeholder="Introduzca su contraseña"/>
                    </label>
                    <button className="buttonL" type="button" id="submit" onClick={handleLogin}>Inicia Sesión</button>
                </div>
                    <div className="img">
                        <div className="content__img">
                            <div className="img__text">
                                <h2>¿Eres nuevo?</h2>
                                <p id="pL">Regístrese para descubrir nuestro catálogo y todas las oportunidades que esconde!</p>
                            </div>
                            <div>
                            <NavLink to="/register" className="buttonL2" id="img__btn">
                                Regístrate
                            </NavLink>
                            </div>
                        </div>
                    </div>
            </div>
        )
    }
}

export default Login;