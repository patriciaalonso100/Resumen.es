import React, { useLayoutEffect, useState } from "react";
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import Swal from 'sweetalert2';
import './css/App.css';
import ProfileMenu from "./components/profile";
import "./css/navbar.css";
import CreateResume from "./pages/Create";
import Favourites from './pages/Favourites';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFoundPage from "./pages/NotFoundPage";
import Profile from './pages/Profile';
import Register from "./pages/Register";
import Resumes from "./pages/Resumes";
import VerifyResumes from "./pages/Verify";
import { ReactComponent as HomeIcon } from "./res/home.svg";
import { ReactComponent as LoginIcon } from "./res/login4.svg";
import logo from './res/logolibros.jpg';
import { ReactComponent as CreateIcon } from "./res/plus.svg";
import { ReactComponent as VerifyIcon } from "./res/verify.svg";
import { UserContext } from "./UserContext";

/**
 * Método para monitorizar el tamaño de la pantalla y poder adaptar la vista a distintos tamaños de pantalla
 * @returns {size}
 */
function useWindowSize() {
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

function App() {

  const [active, setActive] = useState("nav__menu");
  const [icon, setIcon] = useState("nav__toggler");
  const [width, height] = useWindowSize();

  console.log("UserContext:"+ UserContext); 
  const [user, setUser] = useState(UserContext);

  const [show, setShow] = useState(false);

  /**
   * Función que cambia la forma de visualizar el menú de navegación
   */
  const navToggle = () => {
    active === 'nav__menu' ? setActive('nav__menu nav__active') : setActive('nav__menu');
    icon === 'nav__toggler' ? setIcon('nav__toggler toggle') : setIcon('nav__toggler');
  }

  return (
    <UserContext.Provider value={{ user, setUser }} >
      <BrowserRouter>
        <nav className="nav">
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <img src={logo} width='40%' height='50px' style={{ paddingRight: '15%' }} />
            <p className="nav__title">Resumen.es</p>
          </div>
          <ul className={active}>
            <li className="nav__item" style={{ display: show ? 'flex' : 'none' }}>
              <NavLink to="/" className="nav__link">
                <HomeIcon title="Inicio" />
              </NavLink>
            </li>
            <li className="nav__item" style={{ display: show ? 'flex' : 'none' }}>
              <NavLink to="/create" className="nav__link">
                <CreateIcon title="Crear resumen" />
              </NavLink>
            </li>
            <li className="nav__item" style={{ display: show ? ( user.expert ? 'flex' : 'none') : 'none'}}>
              <NavLink to="/verify" className="nav__link">
                <VerifyIcon title="Verificar resúmenes" />
              </NavLink>
            </li>
            <ProfileMenu isMobile={width < 768 ? true : false} show={show}/>
            <li className="nav__item"
              style={{ display: user ? 'flex' : 'none' }}
              onClick={() => {
                if (show) {
                  setUser(null);
                  setShow(false);
                  Swal.fire({
                    title: 'Se ha cerrado sesión con éxito.',
                    text: '¡Vuelta pronto!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    allowOutsideClick: false
                  })
                }
              }}>
              <NavLink to="/login" className="nav__link">
                <LoginIcon title="Cerrar sesión" />
              </NavLink>
            </li>
          </ul>
          <div className={icon} onClick={navToggle}>
            <div className="line1"></div>
            <div className="line2"></div>
            <div className="line3"></div>
          </div>
        </nav>
        <div style={{ marginTop: '0' }}>
          <Routes>
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="/error" element={<NotFoundPage />} />
          </Routes>
        </div>
        <div style={{ marginTop: '75px' }}>
          <Routes>
            <Route path='/' element={user ? <Home show={show} setShow={setShow}/> : <Login show={show} setShow={setShow}/>} />
            <Route path='/login' element={<Login show={show} setShow={setShow}/>} />
            <Route path='/profilepage' element={<Profile />} />
            <Route path='/favourites' element={<Favourites />} />
            <Route path='/resume' element={<Resumes />} />
            <Route path='/register' element={<Register show={show} setShow={setShow}/>} />
            <Route path='/create' element={<CreateResume />} />
            <Route path='/verify' element={<VerifyResumes show={show} setShow={setShow}/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;