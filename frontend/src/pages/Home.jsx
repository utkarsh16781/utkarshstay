import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle.js";

export default function Home() {
    useDocumentTitle();
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    function search(e) {
        e.preventDefault();
        navigate(`/listings${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
    }

    return (
        <>
            <section className="hero">
                <div className="hero__media" aria-hidden="true" />
                <div className="hero__content">
                    <h1 className="hero__title">Stays worth the trip</h1>
                    <p className="hero__lede">
                        Cabins, lofts and quiet corners of the world, listed by the people who
                        keep them.
                    </p>
                    <form className="searchbar" onSubmit={search} role="search">
                        <label className="sr-only" htmlFor="home-search">
                            Search by place or country
                        </label>
                        <input
                            id="home-search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Try Goa, Iceland, or a cabin"
                        />
                        <button className="btn btn--solid" type="submit">
                            Search
                        </button>
                    </form>
                </div>
            </section>

            <section className="band">
                <div className="band__inner">
                    <h2>How it works</h2>
                    <ol className="steps">
                        <li>
                            <h3>Find a place</h3>
                            <p>Filter by country and nightly price until something fits.</p>
                        </li>
                        <li>
                            <h3>Read the reviews</h3>
                            <p>Ratings come from people who actually stayed there.</p>
                        </li>
                        <li>
                            <h3>List your own</h3>
                            <p>Add photos and a price. You stay in control of your listings.</p>
                        </li>
                    </ol>
                    <Link className="btn btn--solid" to="/listings">
                        Browse every stay
                    </Link>
                </div>
            </section>
        </>
    );
}
