import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

export default function RootLayout() {
    return (
        <>
            <a className="skip-link" href="#main">
                Skip to content
            </a>
            <Navbar />
            <main id="main">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}
