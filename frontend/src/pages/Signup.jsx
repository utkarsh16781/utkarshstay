import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import Field from "../components/Field.jsx";
import useDocumentTitle from "../hooks/useDocumentTitle.js";

export default function Signup() {
    useDocumentTitle("Sign up");
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [values, setValues] = useState({ username: "", email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

    function validate() {
        const next = {};
        if (!/^[a-zA-Z0-9]{3,30}$/.test(values.username.trim()))
            next.username = "3–30 letters or numbers, no spaces.";
        if (!/^\S+@\S+\.\S+$/.test(values.email.trim()))
            next.email = "Enter a valid email address.";
        if (values.password.length < 6) next.password = "At least 6 characters.";
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) return;
        setBusy(true);
        setError("");
        try {
            await signup({
                username: values.username.trim(),
                email: values.email.trim(),
                password: values.password,
            });
            navigate("/listings", { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="page page--auth">
            <h1>Create an account</h1>
            <form className="form" onSubmit={handleSubmit} noValidate>
                {error && (
                    <p className="alert alert--error" role="alert">
                        {error}
                    </p>
                )}
                <Field label="Username" id="username" error={errors.username}>
                    <input id="username" autoComplete="username" value={values.username} onChange={set("username")} />
                </Field>
                <Field label="Email" id="email" error={errors.email}>
                    <input id="email" type="email" autoComplete="email" value={values.email} onChange={set("email")} />
                </Field>
                <Field label="Password" id="password" error={errors.password} hint="At least 6 characters.">
                    <input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        value={values.password}
                        onChange={set("password")}
                    />
                </Field>
                <button className="btn btn--solid btn--wide" disabled={busy}>
                    {busy ? "Creating account…" : "Sign up"}
                </button>
            </form>
            <p className="muted">
                Already have an account? <Link to="/login">Log in</Link>.
            </p>
        </div>
    );
}
