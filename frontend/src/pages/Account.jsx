import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listings as api } from "../services/api.js";
import ListingCard from "../components/ListingCard.jsx";
import { Spinner, ErrorState, EmptyState } from "../components/StateMessage.jsx";
import useAuth from "../hooks/useAuth.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";

export default function Account() {
    useDocumentTitle("Your listings");
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");

    useEffect(() => {
        api.mine()
            .then((res) => {
                setData(res.data);
                setStatus("ready");
            })
            .catch((err) => {
                setError(err.message);
                setStatus("error");
            });
    }, []);

    return (
        <div className="page">
            <header className="page__head">
                <h1>{user.username}</h1>
                <p className="muted">{user.email}</p>
            </header>

            <h2>Your listings</h2>
            {status === "loading" && <Spinner label="Loading your listings" />}
            {status === "error" && <ErrorState message={error} />}
            {status === "ready" && data.length === 0 && (
                <EmptyState title="You haven't listed a place yet">
                    <Link className="btn btn--solid" to="/listings/new">
                        Add your first place
                    </Link>
                </EmptyState>
            )}
            {status === "ready" && data.length > 0 && (
                <div className="grid">
                    {data.map((listing) => (
                        <ListingCard key={listing._id} listing={listing} />
                    ))}
                </div>
            )}
        </div>
    );
}
