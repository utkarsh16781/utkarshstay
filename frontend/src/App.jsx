import { Route, Routes } from "react-router-dom";
import RootLayout from "./layouts/RootLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Listings from "./pages/Listings.jsx";
import ListingDetail from "./pages/ListingDetail.jsx";
import NewListing from "./pages/NewListing.jsx";
import EditListing from "./pages/EditListing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Account from "./pages/Account.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
    return (
        <Routes>
            <Route element={<RootLayout />}>
                <Route index element={<Home />} />
                <Route path="/listings" element={<Listings />} />
                {/* "/listings/new" must come before "/listings/:id". */}
                <Route
                    path="/listings/new"
                    element={
                        <ProtectedRoute>
                            <NewListing />
                        </ProtectedRoute>
                    }
                />
                <Route path="/listings/:id" element={<ListingDetail />} />
                <Route
                    path="/listings/:id/edit"
                    element={
                        <ProtectedRoute>
                            <EditListing />
                        </ProtectedRoute>
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/account"
                    element={
                        <ProtectedRoute>
                            <Account />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
