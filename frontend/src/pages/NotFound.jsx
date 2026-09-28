import { Link } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle.js";

export default function NotFound() {
    useDocumentTitle("Page not found");
    return (
        <div className="page page--narrow">
            <h1>That page isn't here</h1>
            <p className="muted">The link may be out of date, or the listing was removed.</p>
            <Link className="btn btn--solid" to="/listings">
                Browse stays
            </Link>
        </div>
    );
}
