import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { listings as api } from "../services/api.js";
import ListingForm from "../components/ListingForm.jsx";
import { Spinner, ErrorState } from "../components/StateMessage.jsx";
import useDocumentTitle from "../hooks/useDocumentTitle.js";

export default function EditListing() {
    useDocumentTitle("Edit listing");
    const { id } = useParams();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");

    useEffect(() => {
        api.get(id)
            .then((res) => {
                setListing(res.data);
                setStatus("ready");
            })
            .catch((err) => {
                setError(err.message);
                setStatus("error");
            });
    }, [id]);

    async function handleSubmit(formData) {
        setError("");
        try {
            await api.update(id, formData);
            navigate(`/listings/${id}`);
        } catch (err) {
            setError(err.message);
        }
    }

    if (status === "loading") return <Spinner label="Loading the listing" />;
    if (status === "error") return <ErrorState message={error} />;

    return (
        <div className="page page--narrow">
            <h1>Edit listing</h1>
            <p className="muted">Changes go live as soon as you save.</p>
            <ListingForm
                initial={listing}
                submitLabel="Save changes"
                onSubmit={handleSubmit}
                serverError={error}
            />
        </div>
    );
}
