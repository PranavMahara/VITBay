import React from "react";
import "./aboutSection.css";

const stack = ["React 18", "Redux", "React Router", "MUI", "Node.js", "Express", "MongoDB", "Mongoose", "JWT auth", "Stripe", "Cloudinary", "Vercel"];

const features = [
    ["Browse & discover", "Searchable catalogue with category, price and rating filters and pagination."],
    ["Product pages", "Image carousel, stock status, quantity picker and customer reviews."],
    ["Cart & checkout", "Persistent cart, shipping details, order confirmation and Stripe payments."],
    ["Accounts", "Secure sign-up and login with JWT cookies, profile updates and password reset by email."],
    ["Admin dashboard", "Manage products, orders, users and reviews from one place."],
    ["Deployed on Vercel", "React frontend and an Express API running as a serverless function."],
];

const About = () => {
    return (
        <div className="vb-about vb-page">
            <section className="vb-about-hero">
                <span className="vb-eyebrow dark">About the project</span>
                <h1>A full-stack store, built end to end.</h1>
                <p>
                    VITBay is a MERN-stack e-commerce application designed and built by{" "}
                    <a href="https://github.com/PranavMahara" target="_blank" rel="noreferrer">Pranav Singh Mahara</a>.
                    It covers everything from the product catalogue and cart to authentication, payments and an admin panel.
                </p>
                <div className="vb-about-cta">
                    <a className="vb-btn dark" href="https://github.com/PranavMahara/VITBay" target="_blank" rel="noreferrer">View the source</a>
                </div>
            </section>

            <section className="vb-about-grid">
                {features.map(([title, text]) => (
                    <div className="vb-about-card" key={title}>
                        <h3>{title}</h3>
                        <p>{text}</p>
                    </div>
                ))}
            </section>

            <section className="vb-about-stack">
                <h2>Tech stack</h2>
                <div>{stack.map((s) => <span key={s}>{s}</span>)}</div>
                <p className="vb-note">
                    This public deployment runs in demo mode: the catalogue is sample data and accounts, orders and payments are switched off.
                </p>
            </section>
        </div>
    );
};

export default About;
