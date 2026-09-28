// One component for the three states every data screen needs.
export function Spinner({ label = "Loading" }) {
    return (
        <div className="state" role="status" aria-live="polite">
            <span className="spinner" aria-hidden="true" />
            <p>{label}…</p>
        </div>
    );
}

export function ErrorState({ message, onRetry }) {
    return (
        <div className="state state--error" role="alert">
            <h2>That didn't load</h2>
            <p>{message}</p>
            {onRetry && (
                <button className="btn btn--solid" onClick={onRetry}>
                    Try again
                </button>
            )}
        </div>
    );
}

export function EmptyState({ title, children }) {
    return (
        <div className="state">
            <h2>{title}</h2>
            {children}
        </div>
    );
}
