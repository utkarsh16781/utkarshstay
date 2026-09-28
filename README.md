# UtkarshStay

A full-stack travel listing platform. Browse places to stay, publish your own,
and review the ones you've visited.

**Backend:** Node.js + Express 5 + MongoDB (Mongoose) + Passport + Cloudinary
**Frontend:** React 18 + React Router + Vite

---

## Features

**Accounts**
- Sign up, log in, log out
- Sessions stored in MongoDB, carried by an `httpOnly` cookie
- `GET /api/auth/me` rehydrates the logged-in user on page refresh

**Listings**
- Browse all listings with search, country filter, max-price filter and sorting
- Paginated results
- Listing detail page with photo, price, description and host
- Create, edit and delete your own listings
- Photo upload to Cloudinary, or an image URL as a fallback
- Replacing a photo deletes the old one from Cloudinary

**Reviews**
- Star rating (1–5) plus a comment
- Any logged-in user can review; only the author can delete their review
- Deleting a listing deletes its reviews

**Authorization** — enforced on the server, not just hidden in the UI
- Only logged-in users can create listings or post reviews
- Only the owner of a listing can edit or delete it
- Only the author of a review can delete it

**Interface**
- Responsive layout with a mobile menu
- Loading, empty and error states on every screen
- Client-side form validation plus server-side Joi validation
- Image preview before upload
- Confirmation dialogs before deleting

---

## Tech stack

| Layer     | What it uses                                                   |
| --------- | -------------------------------------------------------------- |
| Server    | Express 5, Mongoose, Passport (local strategy), Joi, Multer     |
| Database  | MongoDB                                                        |
| Sessions  | `express-session` + `connect-mongo`                            |
| Images    | Cloudinary via `multer-storage-cloudinary`                     |
| Client    | React 18, React Router 6, Vite, plain CSS                      |

---

## Folder structure

```
UtkarshStay-Final/
├── backend/
│   ├── app.js                  Express app, session, passport, route mounting
│   ├── config/                 db.js, cloudinary.js
│   ├── models/                 listing.js, review.js, user.js
│   ├── schemas/                Joi validation schemas
│   ├── middleware/             auth.js, validate.js, upload.js, error.js
│   ├── controllers/            listing.js, review.js, user.js
│   ├── routes/                 index.js, listing.js, review.js, user.js
│   ├── utils/                  wrapAsync.js, ExpressError.js, serialize.js
│   ├── init/                   seed script + sample data
│   ├── legacy/                 the original EJS views, kept for reference
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/         Navbar, ListingCard, ListingForm, …
│   │   ├── pages/              Home, Listings, ListingDetail, Login, …
│   │   ├── services/api.js     every fetch call to the backend
│   │   ├── context/            AuthContext
│   │   ├── hooks/              useAuth, useDocumentTitle
│   │   ├── layouts/            RootLayout
│   │   ├── styles/app.css
│   │   ├── App.jsx             routes
│   │   └── main.jsx
│   ├── vite.config.js          dev proxy: /api → localhost:8080
│   └── index.html
└── package.json                convenience scripts for both halves
```

---

## Setup

You need **Node.js 20 or newer** and a **MongoDB** database (local or Atlas).

### 1. Install dependencies

From the project root:

```bash
npm run install:all
```

Or install each half separately:

```bash
cd backend  && npm install
cd ../frontend && npm install
```

### 2. Set up MongoDB

**Local:** install MongoDB Community Edition, start it, and use
`mongodb://127.0.0.1:27017/utkarshstay`.

**Atlas (free, no local install):** create a cluster at
[mongodb.com/atlas](https://www.mongodb.com/atlas), add a database user, allow
your IP under Network Access, then copy the connection string — it looks like
`mongodb+srv://user:password@cluster.mongodb.net/utkarshstay`.

### 3. Set up Cloudinary (optional)

Sign up at [cloudinary.com](https://cloudinary.com). On the dashboard you'll
find your **Cloud name**, **API Key** and **API Secret**.

If you leave these blank the app still runs — you just paste an image URL into
the listing form instead of uploading a file.

### 4. Environment variables

```bash
cd backend
cp .env.example .env
```

Then fill in `backend/.env`:

| Variable           | What it's for                                          |
| ------------------ | ------------------------------------------------------ |
| `MONGO_URL`        | MongoDB connection string                              |
| `SESSION_SECRET`   | Any long random string — signs the session cookie      |
| `PORT`             | API port (default `8080`)                              |
| `NODE_ENV`         | `development` or `production`                          |
| `CLIENT_URL`       | Origin allowed to call the API (`http://localhost:5173`)|
| `CLOUD_NAME`       | Cloudinary cloud name                                  |
| `CLOUD_API_KEY`    | Cloudinary API key                                     |
| `CLOUD_API_SECRET` | Cloudinary API secret                                  |

A quick way to generate a session secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

The frontend needs no `.env` in development — Vite proxies `/api` to the
backend for you.

### 5. Seed some sample listings (optional)

```bash
npm run seed --prefix backend
```

This wipes the listings collection, creates a demo user
(`demo` / `demo1234`) and inserts the sample data.

---

## Running the app

Open two terminals.

**Terminal 1 — backend:**

```bash
cd backend
npm run dev        # or: npm start
```

You should see `MongoDB connected` and `API running on http://localhost:8080`.

**Terminal 2 — frontend:**

```bash
cd frontend
npm run dev
```

Open **http://localhost:5173**.

### Production build

```bash
npm run build                  # builds frontend/dist
NODE_ENV=production npm start  # backend serves the built app on :8080
```

---

## Using the app

1. **Sign up** from the navbar, or log in as `demo` / `demo1234` if you seeded.
2. **Browse** — search by name or place, filter by country and max price, sort by price.
3. **Open a listing** to read the description and reviews.
4. **Add a place** — fill in the form, upload a photo (or paste a URL), publish.
5. **Edit or delete** — the edit and delete buttons only appear on listings you own, and the API refuses the request if you aren't the owner.
6. **Review** — pick a rating, write a comment, post. You can delete your own reviews.

---

## API reference

| Method   | Endpoint                               | Auth              |
| -------- | -------------------------------------- | ----------------- |
| `GET`    | `/api/health`                          | —                 |
| `POST`   | `/api/auth/signup`                     | —                 |
| `POST`   | `/api/auth/login`                      | —                 |
| `POST`   | `/api/auth/logout`                     | —                 |
| `GET`    | `/api/auth/me`                         | —                 |
| `GET`    | `/api/listings`                        | —                 |
| `GET`    | `/api/listings/countries`              | —                 |
| `GET`    | `/api/listings/mine`                   | logged in         |
| `GET`    | `/api/listings/:id`                    | —                 |
| `POST`   | `/api/listings`                        | logged in         |
| `PUT`    | `/api/listings/:id`                    | owner             |
| `DELETE` | `/api/listings/:id`                    | owner             |
| `POST`   | `/api/listings/:id/reviews`            | logged in         |
| `DELETE` | `/api/listings/:id/reviews/:reviewId`  | review author     |

Every response has the shape `{ success, data }` or `{ success: false, message }`.

`GET /api/listings` accepts `q`, `country`, `minPrice`, `maxPrice`,
`sort` (`newest` | `price-asc` | `price-desc`), `page` and `limit`.

---

## Important notes

- **Never commit `backend/.env`.** It's in `.gitignore`. Only `.env.example`
  belongs in version control. If you previously committed real Cloudinary keys,
  rotate them in the Cloudinary dashboard.
- **Login fails with a "can't reach the server" message?** The backend isn't
  running, or it's on a different port than the Vite proxy expects.
- **Cookies not sticking in production?** Set `NODE_ENV=production` and
  `CLIENT_URL` to your deployed frontend origin. Cross-site cookies need HTTPS.
- **`MONGO_URL is not set`** on startup means you skipped step 4.
- The old EJS views live in `backend/legacy/` and aren't wired into the app.
  Delete the folder when you no longer want them.
