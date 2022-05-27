import Tarjeta from '../components/tarjeta';
import {Row, Col, Container} from 'styled-bootstrap-grid';
import React, {useState, useLayoutEffect} from "react";

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

/**
 * Componente Board que permite ordenar las tarjetas de resúmenes en 3 columnas e infinitas filas
 * @param {any} props
 * @returns {any}
 */
export default function Board(props) {

    const [width, _height] = useWindowSize();

    const [show, setShow] = useState(props.show);


    let modified_collection=[]
    if (props.filtrados.length>0) {
        modified_collection = props.filtrados.reduce( (rows, key, index) =>{ 
            return (index % 3 === 0 ? rows.push([key]) 
            : rows[rows.length-1].push(key)) && rows;
        }, []);  
    }

    let board = modified_collection.map((row) =>
        <Container fluid style={{marginTop: "100px", height: "25rem"}}> 
            <Row row justifyContent='center'>
                {row.map(resume => (<Col col alignSelf='center' >
                    <Tarjeta
                    resumeID = {resume.resumeID}
                    bookTitle = {resume.bookTitle}
                    authorName = {resume.authorName}
                    publisher = {resume.publisher}
                    coverPage = {resume.coverPage}
                    resumeText = {resume.resumeText}
                    verified = {resume.verified}
                    premium = {resume.premium}
                    avgRating = {resume.avgRating}
                    resume = {resume.resume}
                    audio = {resume.audio}
                    show={show}
                    />
                </Col>))}
            </Row>
        </Container>
    )

    let boardMobile = props.filtrados.map((resume) =>
        <Container fluid style={{marginTop: "100px", height: "25rem"}}> 
            <Row row justifyContent='center'>
                <Col col alignSelf='center' >
                    <Tarjeta
                    resumeID = {resume.resumeID}
                    bookTitle = {resume.bookTitle}
                    authorName = {resume.authorName}
                    publisher = {resume.publisher}
                    coverPage = {resume.coverPage}
                    resumeText = {resume.resumeText}
                    verified = {resume.verified}
                    premium = {resume.premium}
                    avgRating = {resume.avgRating}
                    resume = {resume.resume}
                    audio = {resume.audio}
                    show={show}
                    />
                </Col>
            </Row>
        </Container>
    )

    if (width>768) {
        return <div>{board}</div>
    } else {
        return <div>{boardMobile}</div>
    }
}