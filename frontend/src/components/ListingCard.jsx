import { Link } from "react-router-dom";

const money = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
});

export default function ListingCard({ listing }) {
    return (
        <article className="card">
            <Link to={`/listings/${listing._id}`} className="card__link">
                <div className="card__media">
                    <img
                        src={listing.image?.url}
                        alt={listing.title}
                        loading="lazy"
                        width="600"
                        height="400"
                    />
                </div>
                <div className="card__body">
                    <h3 className="card__title">{listing.title}</h3>
                    <p className="card__place">
                        {listing.location}, {listing.country}
                    </p>
                    <p className="card__price">
                        {money.format(listing.price)} <span>per night</span>
                    </p>
                </div>
            </Link>
        </article>
    );
}

export { money };
