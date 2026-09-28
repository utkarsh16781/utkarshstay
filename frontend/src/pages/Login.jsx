import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import Field from "../components/Field.jsx";
import useDocumentTitle from "../hooks/useDocumentTitle.js";

export default function Login() {
    useDocumentTitle("Log in");
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [values, setValues] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

    async function handleSubmit(e) {
        e.preventDefault();
        if (!values.username.trim() || !values.password) {
            setError("Enter your username and password.");
            return;
        }
        setBusy(true);
        setError("");
        try {
            await login({ username: values.username.trim(), password: values.password });
            navigate(location.state?.from || "/listings", { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="page page--auth">
            <h1>Log in</h1>
            <form className="form" onSubmit={handleSubmit} noValidate>
                {error && (
                    <p className="alert alert--error" role="alert">
                        {error}
                    </p>
                )}
                <Field label="Username" id="username">
                    <input id="username" autoComplete="username" value={values.username} onChange={set("username")} />
                </Field>
                <Field label="Password" id="password">
                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        value={values.password}
                        onChange={set("password")}
                    />
                </Field>
                <button className="btn btn--solid btn--wide" disabled={busy}>
                    {busy ? "Logging in…" : "Log in"}
                </button>
            </form>
            <p className="muted">
                New here? <Link to="/signup">Create an account</Link>.
            </p>
        </div>
    );
}
