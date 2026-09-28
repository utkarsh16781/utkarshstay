// Labelled input with an id wired to the label and an inline error slot.
export default function Field({ label, id, error, hint, children }) {
    return (
        <p className="field">
            <label htmlFor={id}>{label}</label>
            {children}
            {hint && !error && <span className="field__hint">{hint}</span>}
            {error && (
                <span className="field__error" role="alert">
                    {error}
                </span>
            )}
        </p>
    );
}
