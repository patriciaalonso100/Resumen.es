import React from "react";
import "../css/navbar.css";
import {ReactComponent as PersonIcon} from "../res/person2.svg";
import {ReactComponent as FavIcon} from "../res/fav.svg";
import {NavLink} from 'react-router-dom';

/**
 * Description
 * @param {any} props
 * @returns {any}
 */
function DropdownMenu(props) {
    function DropdownItem(props) {
        return (
            <NavLink to={{pathname: `/${props.route}`}} className="menu__item">
                {props.children}
            </NavLink>
        )
    }
    return (
        <div className="dropdown">
            <DropdownItem route="profilepage">
                <span className="menu__item__logo">
                    <PersonIcon title=""/>
                </span>
                Perfil
            </DropdownItem>
            <DropdownItem route="favourites">
                <span className="menu__item__logo">
                    <FavIcon title=""/>
                </span>
                Mis resúmenes
            </DropdownItem>
        </div>
    );
}

export default DropdownMenu;