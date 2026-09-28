import { useState } from "react";
import { StarInput } from "./StarRating.jsx";
import Field from "./Field.jsx";

export default function ReviewForm({ onSubmit }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (comment.trim().length < 3) {
            setError("Write a few words about your stay.");
            return;
        }
        setError("");
        setBusy(true);
        try {
            await onSubmit({ rating: Number(rating), comment: comment.trim() });
            setComment("");
            setRating(5);
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    }

    return (
        <form className="form form--inline" onSubmit={handleSubmit} noValidate>
            <StarInput value={rating} onChange={setRating} />
            <Field label="Your review" id="comment" error={error}>
                <textarea
                    id="comment"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What was it like to stay here?"
                />
            </Field>
            <button className="btn btn--solid" type="submit" disabled={busy}>
                {busy ? "Posting…" : "Post review"}
            </button>
        </form>
    );
}
