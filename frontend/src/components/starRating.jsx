import React, {useState} from "react";
import '../css/home.css';
import {FaStar} from 'react-icons/fa';

/**
 * Componente que genera las estrellas para la valoración de los resúmenes
 * @param {any} props
 * @returns {any}
 */
const StarRating = (props) => {

    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);

    const sendRating = (ratingValue) => {
        props.sendRating(ratingValue);
    }

    return (
    <div>
        { [...Array(5)].map((_star, i) => {
            const ratingValue = i+1;
            return (
            <label>
                <input 
                    type="radio" 
                    name="rating" 
                    value={ratingValue}
                    onClick={() => {
                        setRating(ratingValue);
                        sendRating(ratingValue);
                    }}
                />
                <FaStar 
                    className="star" 
                    color={ratingValue <= (hover || rating) ? "#F7CE3E" : "#e4e5e9"} 
                    size={20}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(null)}
                />
            </label>
            )
        })}
    </div>
    )
}

export default StarRating;