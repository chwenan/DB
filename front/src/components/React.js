import { useState, useEffect } from "react";
import axios from "axios";

const BentoList = () => {
    const [bentos, setBentos] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/bentos")
            .then(response => {
                setBentos(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the bentos!", error);
            });
    }, []);

    return (
        <div>
            <h2>Our Bento Menu</h2>
            <ul>
                {bentos.map(bento => (
                    <li key={bento._id}>
                        <h3>{bento.name}</h3>
                        <p>{bento.description}</p>
                        <p>Price: ${bento.price}</p>
                        <img src={bento.imageUrl} alt={bento.name} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BentoList;
