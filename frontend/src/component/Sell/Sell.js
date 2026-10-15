import React, { useState } from "react";
import axios from "axios";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Sell.css";

const categories = [
    ["Laptop", "Laptops"], ["SmartPhones", "Phones"], ["Camera", "Cameras"], ["Books", "Books"],
    ["Hostel", "Hostel essentials"], ["Footwear", "Footwear"], ["Tops", "Tops"], ["Bottom", "Bottoms"], ["Attire", "Jackets & hoodies"],
];

// Downscale photos in the browser so uploads stay small and fast
const readImage = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            const img = new Image();
            img.onerror = reject;
            img.onload = () => {
                const scale = Math.min(1, 1000 / Math.max(img.width, img.height));
                const canvas = document.createElement("canvas");
                canvas.width = Math.round(img.width * scale);
                canvas.height = Math.round(img.height * scale);
                canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL("image/jpeg", 0.8));
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });

export default function Sell() {
    const alert = useAlert();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.user);

    const [form, setForm] = useState({
        name: "", category: "", condition: "Good", price: "", originalPrice: "", location: "", description: "",
    });
    const [images, setImages] = useState([]);
    const [busy, setBusy] = useState(false);

    const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    const onPhotos = async (e) => {
        const files = Array.from(e.target.files).slice(0, 5 - images.length);
        try {
            const next = await Promise.all(files.map(readImage));
            setImages([...images, ...next]);
        } catch {
            alert.error("Could not read one of those photos");
        }
        e.target.value = "";
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            alert.error("Please log in to post a listing");
            navigate("/login");
            return;
        }
        if (images.length === 0) {
            alert.error("Add at least one photo");
            return;
        }
        setBusy(true);
        try {
            const { data } = await axios.post("/api/v1/product/new", { ...form, images });
            alert.success("Your listing is live");
            navigate(`/product/${data.product._id}`);
        } catch (error) {
            alert.error(error.response?.data?.message || error.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="sellPage">
            <div className="sellIntro">
                <p className="sellKicker">post a listing</p>
                <h1>Sell something on campus</h1>
                <p>Good photos and an honest description sell things fastest. Listings are free.</p>
            </div>

            <form className="sellForm" onSubmit={submit}>
                <label>Title
                    <input required maxLength={80} value={form.name} onChange={set("name")} placeholder="e.g. Scientific calculator, barely used" />
                </label>

                <div className="sellRow">
                    <label>Category
                        <select required value={form.category} onChange={set("category")}>
                            <option value="">Choose one</option>
                            {categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                    </label>
                    <label>Condition
                        <select value={form.condition} onChange={set("condition")}>
                            <option>Like new</option>
                            <option>Good</option>
                            <option>Fair</option>
                        </select>
                    </label>
                </div>

                <div className="sellRow">
                    <label>Your price (₹)
                        <input required type="number" min="1" value={form.price} onChange={set("price")} />
                    </label>
                    <label>Price when new (₹), optional
                        <input type="number" min="1" value={form.originalPrice} onChange={set("originalPrice")} />
                    </label>
                </div>

                <label>Where can you meet?
                    <input value={form.location} onChange={set("location")} placeholder="e.g. Block C lobby, or main canteen" />
                </label>

                <label>Description
                    <textarea required rows={5} value={form.description} onChange={set("description")} placeholder="Age, condition, what's included, why you're selling" />
                </label>

                <div className="sellPhotos">
                    <span>Photos ({images.length}/5)</span>
                    <div>
                        {images.map((src, i) => (
                            <figure key={i}>
                                <img src={src} alt={`Upload ${i + 1}`} />
                                <button type="button" aria-label="Remove photo" onClick={() => setImages(images.filter((_, j) => j !== i))}>×</button>
                            </figure>
                        ))}
                        {images.length < 5 && (
                            <label className="addPhoto">
                                +
                                <input type="file" accept="image/*" multiple onChange={onPhotos} hidden />
                            </label>
                        )}
                    </div>
                </div>

                <button type="submit" className="sellSubmit" disabled={busy}>{busy ? "Posting…" : "Post listing"}</button>
            </form>
        </div>
    );
}
