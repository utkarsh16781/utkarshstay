import { useEffect, useRef } from "react";

// Small accessible confirmation used before destructive actions.
export default function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel, busy }) {
    const ref = useRef(null);

    useEffect(() => {
        if (open) ref.current?.focus();
        const onKey = (e) => e.key === "Escape" && onCancel();
        if (open) window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onCancel]);

    if (!open) return null;

    return (
        <div className="overlay" onClick={onCancel}>
            <div
                className="dialog"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="dialog-title"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="dialog-title">{title}</h2>
                <p>{message}</p>
                <div className="dialog__actions">
                    <button className="btn btn--ghost" onClick={onCancel} ref={ref}>
                        Keep it
                    </button>
                    <button className="btn btn--danger" onClick={onConfirm} disabled={busy}>
                        {busy ? "Working…" : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
