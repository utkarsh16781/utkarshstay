import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { listings as api, reviews as reviewApi } from "../services/api.js";
import { Spinner, ErrorState } from "../components/StateMessage.jsx";
import StarRating from "../components/StarRating.jsx";
import ReviewList from "../components/ReviewList.jsx";
import ReviewForm from "../components/ReviewForm.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { money } from "../components/ListingCard.jsx";
import useAuth from "../hooks/useAuth.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";

export default function ListingDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [listing, setListing] = useState(null);
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");
    const [confirm, setConfirm] = useState(null); // null | "listing" | reviewId
    const [busy, setBusy] = useState(false);

    useDocumentTitle(listing?.title);

    const load = useCallback(async () => {
        setStatus("loading");
        try {
            const res = await api.get(id);
            setListing(res.data);
            setStatus("ready");
        } catch (err) {
            setError(err.message);
            setStatus("error");
        }
    }, [id]);

    useEffect(() => {
        load();
    }, [load]);

    if (status === "loading") return <Spinner label="Loading this stay" />;
    if (status === "error")
        return (
            <div className="page">
                <ErrorState message={error} onRetry={load} />
                <Link className="btn btn--ghost" to="/listings">
                    Back to all stays
                </Link>
            </div>
        );

    const isOwner = user && listing.owner?._id === user._id;
    const ratings = listing.reviews.map((r) => r.rating);
    const average = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

    async function addReview(body) {
        const res = await reviewApi.create(id, body);
        setListing((l) => ({ ...l, reviews: [res.data, ...l.reviews] }));
    }

    async function deleteReview(reviewId) {
        setBusy(true);
        try {
            await reviewApi.remove(id, reviewId);
            setListing((l) => ({ ...l, reviews: l.reviews.filter((r) => r._id !== reviewId) }));
            setConfirm(null);
        } catch (err) {
            setError(err.message);
            setStatus("error");
        } finally {
            setBusy(false);
        }
    }

    async function deleteListing() {
        setBusy(true);
        try {
            await api.remove(id);
            navigate("/listings");
        } catch (err) {
            setError(err.message);
            setStatus("error");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="page detail">
            <nav className="crumbs">
                <Link to="/listings">All stays</Link>
                <span aria-hidden="true">/</span>
                <span>{listing.location}</span>
            </nav>

            <div className="detail__media">
                <img src={listing.image?.url} alt={listing.title} />
            </div>

            <div className="detail__grid">
                <div>
                    <h1 className="detail__title">{listing.title}</h1>
                    <p className="detail__place">
                        {listing.location}, {listing.country}
                    </p>
                    {ratings.length > 0 && (
                        <StarRating value={average} count={ratings.length} />
                    )}
                    <p className="detail__description">{listing.description}</p>
                    <p className="muted">Hosted by {listing.owner?.username || "a member"}</p>
                </div>

                <aside className="detail__panel">
                    <p className="detail__price">
                        {money.format(listing.price)} <span>per night</span>
                    </p>
                    {isOwner ? (
                        <div className="detail__owner-actions">
                            <Link className="btn btn--solid btn--wide" to={`/listings/${id}/edit`}>
                                Edit listing
                            </Link>
                            <button
                                className="btn btn--danger btn--wide"
                                onClick={() => setConfirm("listing")}
                            >
                                Delete listing
                            </button>
                        </div>
                    ) : (
                        <p className="muted">
                            Only the host can change this listing.
                        </p>
                    )}
                </aside>
            </div>

            <section className="detail__reviews">
                <h2>Reviews</h2>
                {user ? (
                    <ReviewForm onSubmit={addReview} />
                ) : (
                    <p className="muted">
                        <Link to="/login">Log in</Link> to leave a review.
                    </p>
                )}
                <ReviewList
                    reviews={listing.reviews}
                    currentUser={user}
                    onDelete={(reviewId) => setConfirm(reviewId)}
                />
            </section>

            <ConfirmDialog
                open={confirm === "listing"}
                title="Delete this listing?"
                message="The listing and all of its reviews will be removed. This cannot be undone."
                confirmLabel="Delete listing"
                busy={busy}
                onCancel={() => setConfirm(null)}
                onConfirm={deleteListing}
            />
            <ConfirmDialog
                open={Boolean(confirm) && confirm !== "listing"}
                title="Delete your review?"
                message="Your rating and comment will be removed from this listing."
                confirmLabel="Delete review"
                busy={busy}
                onCancel={() => setConfirm(null)}
                onConfirm={() => deleteReview(confirm)}
            />
        </div>
    );
}
