import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { listings as api } from "../services/api.js";
import ListingCard from "../components/ListingCard.jsx";
import { Spinner, ErrorState, EmptyState } from "../components/StateMessage.jsx";
import useDocumentTitle from "../hooks/useDocumentTitle.js";

export default function Listings() {
    useDocumentTitle("Browse stays");
    const [params, setParams] = useSearchParams();
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
    const [countries, setCountries] = useState([]);
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");

    const query = {
        q: params.get("q") || "",
        country: params.get("country") || "",
        maxPrice: params.get("maxPrice") || "",
        sort: params.get("sort") || "newest",
        page: params.get("page") || "1",
    };

    const load = useCallback(async () => {
        setStatus("loading");
        try {
            const res = await api.list(query);
            setData(res.data);
            setMeta(res.meta);
            setStatus("ready");
        } catch (err) {
            setError(err.message);
            setStatus("error");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    useEffect(() => {
        load();
    }, [load]);

    useEffect(() => {
        api.countries().then((res) => setCountries(res.data)).catch(() => {});
    }, []);

    function update(key, value) {
        const next = new URLSearchParams(params);
        if (value) next.set(key, value);
        else next.delete(key);
        if (key !== "page") next.delete("page");
        setParams(next);
    }

    return (
        <div className="page">
            <header className="page__head">
                <h1>Browse stays</h1>
                <p className="muted">
                    {status === "ready"
                        ? `${meta.total} ${meta.total === 1 ? "place" : "places"} to stay`
                        : "\u00a0"}
                </p>
            </header>

            <form className="filters" onSubmit={(e) => e.preventDefault()} role="search">
                <label className="sr-only" htmlFor="q">
                    Search
                </label>
                <input
                    id="q"
                    defaultValue={query.q}
                    placeholder="Search places"
                    onKeyDown={(e) => e.key === "Enter" && update("q", e.target.value)}
                    onBlur={(e) => e.target.value !== query.q && update("q", e.target.value)}
                />

                <label className="sr-only" htmlFor="country">
                    Country
                </label>
                <select id="country" value={query.country} onChange={(e) => update("country", e.target.value)}>
                    <option value="">Any country</option>
                    {countries.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>

                <label className="sr-only" htmlFor="maxPrice">
                    Maximum price
                </label>
                <input
                    id="maxPrice"
                    type="number"
                    min="0"
                    placeholder="Max ₹ / night"
                    defaultValue={query.maxPrice}
                    onBlur={(e) => update("maxPrice", e.target.value)}
                />

                <label className="sr-only" htmlFor="sort">
                    Sort
                </label>
                <select id="sort" value={query.sort} onChange={(e) => update("sort", e.target.value)}>
                    <option value="newest">Newest first</option>
                    <option value="price-asc">Price: low to high</option>
                    <option value="price-desc">Price: high to low</option>
                </select>
            </form>

            {status === "loading" && <Spinner label="Finding stays" />}
            {status === "error" && <ErrorState message={error} onRetry={load} />}

            {status === "ready" && data.length === 0 && (
                <EmptyState title="Nothing matched that search">
                    <p>Try a different country or raise the price ceiling.</p>
                    <Link className="btn btn--ghost" to="/listings">
                        Clear filters
                    </Link>
                </EmptyState>
            )}

            {status === "ready" && data.length > 0 && (
                <>
                    <div className="grid">
                        {data.map((listing) => (
                            <ListingCard key={listing._id} listing={listing} />
                        ))}
                    </div>

                    {meta.pages > 1 && (
                        <nav className="pager" aria-label="Pagination">
                            <button
                                className="btn btn--ghost"
                                disabled={meta.page <= 1}
                                onClick={() => update("page", String(meta.page - 1))}
                            >
                                Previous
                            </button>
                            <span>
                                Page {meta.page} of {meta.pages}
                            </span>
                            <button
                                className="btn btn--ghost"
                                disabled={meta.page >= meta.pages}
                                onClick={() => update("page", String(meta.page + 1))}
                            >
                                Next
                            </button>
                        </nav>
                    )}
                </>
            )}
        </div>
    );
}
