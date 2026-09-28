import { createContext, useCallback, useEffect, useState } from "react";
import { auth } from "../services/api.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Ask the server who we are on first load - the session cookie is the
    // source of truth, not anything stored in the browser.
    useEffect(() => {
        auth
            .me()
            .then((res) => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = useCallback(async (credentials) => {
        const res = await auth.login(credentials);
        setUser(res.data);
        return res.data;
    }, []);

    const signup = useCallback(async (details) => {
        const res = await auth.signup(details);
        setUser(res.data);
        return res.data;
    }, []);

    const logout = useCallback(async () => {
        await auth.logout();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
