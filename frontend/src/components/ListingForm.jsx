import { useState } from "react";
import Field from "./Field.jsx";

const REQUIRED = ["title", "description", "location", "country", "price"];

// Shared by the create and edit pages. `initial` pre-fills for editing.
export default function ListingForm({ initial = {}, submitLabel, onSubmit, serverError }) {
    const [values, setValues] = useState({
        title: initial.title || "",
        description: initial.description || "",
        location: initial.location || "",
        country: initial.country || "",
        price: initial.price ?? "",
        imageUrl: initial.image?.url || "",
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(initial.image?.url || "");
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);

    const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

    function pickFile(e) {
        const selected = e.target.files[0];
        setFile(selected || null);
        setPreview(selected ? URL.createObjectURL(selected) : values.imageUrl);
    }

    function validate() {
        const next = {};
        REQUIRED.forEach((key) => {
            if (String(values[key]).trim() === "") next[key] = "This field is required.";
        });
        if (values.title && values.title.trim().length < 3)
            next.title = "Give it a name of at least 3 characters.";
        if (values.description && values.description.trim().length < 10)
            next.description = "Add a little more detail — at least 10 characters.";
        if (values.price !== "" && Number(values.price) < 0)
            next.price = "Price cannot be negative.";
        if (values.price !== "" && Number.isNaN(Number(values.price)))
            next.price = "Price must be a number.";
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) return;

        // Multipart, because the image may be a real file upload.
        const data = new FormData();
        data.append("title", values.title.trim());
        data.append("description", values.description.trim());
        data.append("location", values.location.trim());
        data.append("country", values.country.trim());
        data.append("price", values.price);
        if (file) data.append("image", file);
        else if (values.imageUrl) data.append("imageUrl", values.imageUrl.trim());

        setBusy(true);
        try {
            await onSubmit(data);
        } finally {
            setBusy(false);
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit} noValidate>
            {serverError && (
                <p className="alert alert--error" role="alert">
                    {serverError}
                </p>
            )}

            <Field label="Name of the place" id="title" error={errors.title}>
                <input id="title" value={values.title} onChange={set("title")} maxLength={120} />
            </Field>

            <Field label="Description" id="description" error={errors.description}>
                <textarea
                    id="description"
                    rows={5}
                    value={values.description}
                    onChange={set("description")}
                />
            </Field>

            <div className="form__row">
                <Field label="Location" id="location" error={errors.location}>
                    <input id="location" value={values.location} onChange={set("location")} />
                </Field>
                <Field label="Country" id="country" error={errors.country}>
                    <input id="country" value={values.country} onChange={set("country")} />
                </Field>
            </div>

            <Field label="Price per night (₹)" id="price" error={errors.price}>
                <input id="price" type="number" min="0" value={values.price} onChange={set("price")} />
            </Field>

            <Field
                label="Photo"
                id="image"
                hint="Upload a JPG, PNG or WEBP up to 5 MB."
            >
                <input id="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={pickFile} />
            </Field>

            <Field
                label="…or paste an image link"
                id="imageUrl"
                hint="Used when no file is uploaded."
            >
                <input
                    id="imageUrl"
                    type="url"
                    value={values.imageUrl}
                    onChange={(e) => {
                        set("imageUrl")(e);
                        if (!file) setPreview(e.target.value);
                    }}
                />
            </Field>

            {preview && (
                <figure className="preview">
                    <img src={preview} alt="Preview of the photo you chose" />
                    <figcaption>Preview</figcaption>
                </figure>
            )}

            <button className="btn btn--solid btn--wide" type="submit" disabled={busy}>
                {busy ? "Saving…" : submitLabel}
            </button>
        </form>
    );
}
