import React, {useState} from "react";
import DropdownMenu from './dropdown';
import {ReactComponent as PersonIcon} from "../res/person2.svg";
import {ReactComponent as FavIcon} from "../res/fav.svg";
import { NavLink } from 'react-router-dom';
import "../css/navbar.css";


/**
 * Componente del menú de navegación que despliega las opciones de acceder a la página de "Profile" o a la de "Mis favoritos"
 * @param {any} props
 * @returns {any}
 */
function ProfileMenu (props) {
    const [open, setOpen] = useState(false);
    
    if (props.isMobile) {
        return(
            <div className="profile__menu" style={{display: props.show ? 'flex' : 'none'}}>
                <li className="nav__item">
                    <NavLink to="/profilepage" className="nav__link">
                    <PersonIcon title="Profile"/>
                    </NavLink>
                    </li>
                    <li className="nav__item">
                    <NavLink to="/favourites" className="nav__link">
                        <FavIcon title="Favourites"/>
                    </NavLink>
                </li>
            </div>
        )
    } else {
        return(
            <li className="nav__item" style={{display: props.show ? 'flex' : 'none'}}>
              <NavLink to="#" className="nav__link" onClick={() => setOpen(!open)}>
                <PersonIcon title="Perfil"/>
              </NavLink>
              {open && <DropdownMenu/>}
            </li>
        )
    }
}

export default ProfileMenu;