import '../css/home.css';
import React, {useState, useLayoutEffect} from "react";

/**
 * Método para monitorizar el tamaño de la pantalla y poder adaptar la vista a distintos tamaños de pantalla
 * @returns {any}
 */
 function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    const [showDialog, setShowDialog] = React.useState(null); //esto se utiliza ?
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
 * Barra de búsqueda de resúmenes
 * Permite agregar filtros a la búsqueda
 * 
 * @param {any} props
 * @returns {any}
 */
export default function Searchbar(props){

    // Handle resize
    const [width, _height] = useWindowSize();

    function myhandleChange(){
        props.handleChange(); 
    }

    // function myresetSearch(){
    //     props.resetSearch(); 
    // }

    function filterActive(){
        props.filterActive();
    }

    function filterInactive(){
        props.filterInactive();
    }

    function filterTitle(){
        props.filterTitle();
    }

    function filterAuthor(){
        props.filterAuthor();
    }

    function filterPublisher(){
        props.filterPublisher();
    }

    function filterAll(){
        props.filterAll();
    }

    function resetFilter(){
        filterAll();
        filterInactive();
    }

    return (
        <div className="searchBar">
            <div className="containerInput">
                <input 
                    id="inputSearch"
                    className="inputSearch"
                    type="text"
                    placeholder={width>768 ? "Búsqueda por Nombre o Empresa" : "Búsqueda..."} 
                    onChange={() => myhandleChange()}
                />
                <div className="filtersAux">
                    <button className="btnSearch" onClick={()=>filterActive()}>FILTROS</button>
                    {props.fActive ? 
                    <div className="contFilters">
                        <label onClick={()=>filterTitle()}><li className="filterItem" ><input type="checkbox" /> Título</li></label>
                        <label onClick={()=>filterAuthor()}><li className="filterItem" ><input type="checkbox" /> Autor</li></label>
                        <label onClick={()=>filterPublisher()}><li className="filterItem" ><input type="checkbox" /> Editorial</li></label>
                        <li className="filterItem" ><button className="btnFilter" onClick={()=>filterInactive()}>APLICAR FILTROS</button></li>
                        <li className="filterItem" ><button className="btnFilter" onClick={()=>resetFilter()}>BORRAR FILTROS</button></li>
                    </div> : <div></div>} 
                </div>
            </div>
        </div>
    );

}