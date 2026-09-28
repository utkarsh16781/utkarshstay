const Star = ({ filled }) => (
    <svg viewBox="0 0 20 20" className={`star ${filled ? "star--on" : ""}`} aria-hidden="true">
        <path d="M10 1.6l2.5 5.3 5.7.8-4.1 4 1 5.7-5.1-2.8-5.1 2.8 1-5.7-4.1-4 5.7-.8z" />
    </svg>
);

// Read-only display.
export default function StarRating({ value, count }) {
    return (
        <span className="rating">
            <span className="rating__stars" aria-label={`${value} out of 5`}>
                {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} filled={n <= Math.round(value)} />
                ))}
            </span>
            {count != null && (
                <span className="rating__count">
                    {count} {count === 1 ? "review" : "reviews"}
                </span>
            )}
        </span>
    );
}

// Interactive input used by the review form.
export function StarInput({ value, onChange, name = "rating" }) {
    return (
        <fieldset className="rating-input">
            <legend>Your rating</legend>
            {[1, 2, 3, 4, 5].map((n) => (
                <label key={n} className="rating-input__option">
                    <input
                        type="radio"
                        name={name}
                        value={n}
                        checked={Number(value) === n}
                        onChange={() => onChange(n)}
                    />
                    <span className="sr-only">{n} stars</span>
                    <Star filled={n <= Number(value)} />
                </label>
            ))}
        </fieldset>
    );
}
