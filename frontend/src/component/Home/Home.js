import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import "./Home.css";
import { clearErrors, getProduct } from '../../actions/productsAction';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';
import coverImage from "../../images/cover.jfif";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";

const photo = (id) => `https://images.unsplash.com/${id}?w=600&h=600&fit=crop&auto=format&q=75`;

const categories = [
    { name: "Laptop", img: photo("photo-1611186871348-b1ce696e52c9") },
    { name: "SmartPhones", img: photo("photo-1560617544-b4f287789e24") },
    { name: "Camera", img: photo("photo-1516035069371-29a1b244cc32") },
    { name: "Footwear", img: photo("photo-1542291026-7eec264c27ff") },
    { name: "Attire", img: photo("photo-1620799140188-3b2a02fd9a77") },
    { name: "Tops", img: photo("photo-1623658580851-3b25bf83b4ea") },
    { name: "Bottom", img: photo("photo-1714143136372-ddaf8b606da7") },
];

const perks = [
    { icon: <LocalShippingOutlinedIcon />, title: "Free delivery", text: "On orders above ₹999" },
    { icon: <ReplayOutlinedIcon />, title: "Easy returns", text: "7-day hassle-free returns" },
    { icon: <VerifiedUserOutlinedIcon />, title: "Secure payments", text: "Encrypted checkout" },
    { icon: <SupportAgentOutlinedIcon />, title: "Friendly support", text: "We reply within a day" },
];

export default function Home() {
    const alert = useAlert()
    const dispatch = useDispatch()

    const { loading, error, products } = useSelector((state) => state.products)

    useEffect(() => {
        dispatch(getProduct())
    }, [dispatch])

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
    }, [dispatch, error, alert])

    return (
        <Fragment>
            <section className="vb-hero" style={{ backgroundImage: `linear-gradient(100deg, rgba(15,23,42,.92) 0%, rgba(15,23,42,.65) 45%, rgba(15,23,42,.1) 100%), url(${coverImage})` }}>
                <div className="vb-page">
                    <span className="vb-eyebrow">New season · Free delivery over ₹999</span>
                    <h1>Everything you need,<br />one click away.</h1>
                    <p>Laptops, phones, cameras and everyday fashion, hand-picked and delivered to your door.</p>
                    <div className="vb-hero-cta">
                        <Link to="/products" className="vb-btn primary">Shop now</Link>
                        <Link to="/search" className="vb-btn ghost">Search products</Link>
                    </div>
                </div>
            </section>

            <section className="vb-perks vb-page">
                {perks.map((p) => (
                    <div className="vb-perk" key={p.title}>
                        <span>{p.icon}</span>
                        <div><b>{p.title}</b><small>{p.text}</small></div>
                    </div>
                ))}
            </section>

            <section className="vb-section vb-page">
                <div className="vb-section-head">
                    <h2>Shop by category</h2>
                </div>
                <div className="vb-cats">
                    {categories.map((c) => (
                        <Link key={c.name} to={`/products?category=${c.name}`} className="vb-cat">
                            <img src={c.img} alt={c.name} loading="lazy" />
                            <span>{c.name === "SmartPhones" ? "Smartphones" : c.name}</span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="vb-section vb-page">
                <div className="vb-section-head">
                    <h2>Trending products</h2>
                    <Link to="/products">View all →</Link>
                </div>
                {loading ? <Loader /> : (
                    <div className="vb-grid">
                        {products && products.slice(0, 8).map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            <section className="vb-promo vb-page">
                <div>
                    <span className="vb-eyebrow dark">Limited time</span>
                    <h2>Upgrade your setup</h2>
                    <p>Explore our latest laptops, smartphones and cameras at prices students love.</p>
                </div>
                <Link to="/products?category=Laptop" className="vb-btn primary">Browse laptops</Link>
            </section>
        </Fragment>
    )
}
