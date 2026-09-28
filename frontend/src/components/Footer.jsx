import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__inner">
                <p className="footer__brand">UtkarshStay</p>
                <nav className="footer__links">
                    <Link to="/listings">Browse stays</Link>
                    <Link to="/listings/new">Add a place</Link>
                    <Link to="/account">Your listings</Link>
                </nav>
                <p className="footer__note">
                    A full-stack demo project — Express, MongoDB and React.
                </p>
            </div>
        </footer>
    );
}
