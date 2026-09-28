import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { listings as api } from "../services/api.js";
import ListingForm from "../components/ListingForm.jsx";
import useDocumentTitle from "../hooks/useDocumentTitle.js";

export default function NewListing() {
    useDocumentTitle("Add a place");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(formData) {
        setError("");
        try {
            const res = await api.create(formData);
            navigate(`/listings/${res.data._id}`);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="page page--narrow">
            <h1>Add a place</h1>
            <p className="muted">Tell travellers what makes it worth the trip.</p>
            <ListingForm submitLabel="Publish listing" onSubmit={handleSubmit} serverError={error} />
        </div>
    );
}
