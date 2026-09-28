import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import { Spinner } from "./StateMessage.jsx";

// Convenience only. The API enforces the same rules server-side.
export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <Spinner label="Checking your session" />;
    if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    return children;
}
