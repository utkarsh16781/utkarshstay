const BASE = import.meta.env.VITE_API_URL || "/api";

// Thrown for every non-2xx response so callers can show the server's message.
export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

async function request(path, { method = "GET", body, isForm = false } = {}) {
    const options = {
        method,
        credentials: "include", // send the session cookie
        headers: isForm ? {} : { "Content-Type": "application/json" },
    };
    if (body !== undefined) options.body = isForm ? body : JSON.stringify(body);

    let res;
    try {
        res = await fetch(`${BASE}${path}`, options);
    } catch {
        throw new ApiError("Can't reach the server. Is the backend running?", 0);
    }

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new ApiError(payload.message || "Something went wrong.", res.status);
    }
    return payload;
}

const qs = (params) => {
    const clean = Object.entries(params).filter(([, v]) => v !== "" && v != null);
    return clean.length ? `?${new URLSearchParams(clean)}` : "";
};

export const auth = {
    me: () => request("/auth/me"),
    login: (credentials) => request("/auth/login", { method: "POST", body: credentials }),
    signup: (details) => request("/auth/signup", { method: "POST", body: details }),
    logout: () => request("/auth/logout", { method: "POST" }),
};

export const listings = {
    list: (params = {}) => request(`/listings${qs(params)}`),
    countries: () => request("/listings/countries"),
    mine: () => request("/listings/mine"),
    get: (id) => request(`/listings/${id}`),
    create: (formData) => request("/listings", { method: "POST", body: formData, isForm: true }),
    update: (id, formData) =>
        request(`/listings/${id}`, { method: "PUT", body: formData, isForm: true }),
    remove: (id) => request(`/listings/${id}`, { method: "DELETE" }),
};

export const reviews = {
    create: (listingId, body) =>
        request(`/listings/${listingId}/reviews`, { method: "POST", body }),
    remove: (listingId, reviewId) =>
        request(`/listings/${listingId}/reviews/${reviewId}`, { method: "DELETE" }),
};
