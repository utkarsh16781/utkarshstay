import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

export default function Navbar() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const close = () => setOpen(false);

    async function handleLogout() {
        close();
        await logout();
        navigate("/");
    }

    return (
        <header className="nav">
            <div className="nav__inner">
                <Link to="/" className="nav__brand" onClick={close}>
                    UtkarshStay
                </Link>

                <button
                    className="nav__toggle"
                    aria-expanded={open}
                    aria-controls="primary-nav"
                    aria-label={open ? "Close menu" : "Open menu"}
                    onClick={() => setOpen((v) => !v)}
                >
                    <span className={`burger ${open ? "burger--open" : ""}`} />
                </button>

                <nav id="primary-nav" className={`nav__links ${open ? "nav__links--open" : ""}`}>
                    <NavLink to="/listings" onClick={close}>
                        Browse
                    </NavLink>
                    {user ? (
                        <>
                            <NavLink to="/listings/new" onClick={close}>
                                Add a place
                            </NavLink>
                            <NavLink to="/account" onClick={close}>
                                {user.username}
                            </NavLink>
                            <button className="btn btn--ghost" onClick={handleLogout}>
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" onClick={close}>
                                Log in
                            </NavLink>
                            <Link to="/signup" className="btn btn--solid" onClick={close}>
                                Sign up
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
