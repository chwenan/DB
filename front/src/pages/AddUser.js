import { useState } from "react";
import axios from "axios";

const AddBento = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const newBento = { name, description, price, imageUrl };

        axios.post("http://localhost:5000/bentos", newBento)
            .then(response => {
                console.log("Bento added:", response.data);
            })
            .catch(error => {
                console.error("There was an error adding the bento!", error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Bento Name:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
                Description:
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            <label>
                Price:
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </label>
            <label>
                Image URL:
                <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </label>
            <button type="submit">Add Bento</button>
        </form>
    );
};

export default AddBento;
