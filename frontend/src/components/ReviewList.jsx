import StarRating from "./StarRating.jsx";

const when = (iso) =>
    new Date(iso).toLocaleDateString(undefined, { month: "long", year: "numeric" });

export default function ReviewList({ reviews, currentUser, onDelete }) {
    if (!reviews.length) {
        return <p className="muted">No reviews yet. Be the first to write one.</p>;
    }

    return (
        <ul className="reviews">
            {reviews.map((review) => {
                const mine = currentUser && review.author?._id === currentUser._id;
                return (
                    <li key={review._id} className="review">
                        <div className="review__head">
                            <p className="review__author">{review.author?.username || "Someone"}</p>
                            <StarRating value={review.rating} />
                        </div>
                        <p className="review__comment">{review.comment}</p>
                        <p className="review__meta">
                            {when(review.createdAt)}
                            {mine && (
                                <button className="link-btn" onClick={() => onDelete(review._id)}>
                                    Delete
                                </button>
                            )}
                        </p>
                    </li>
                );
            })}
        </ul>
    );
}
