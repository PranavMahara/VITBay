import React from "react";
import "./aboutSection.css";

const stack = ["React", "Redux", "React Router", "MUI", "Node.js", "Express", "MongoDB", "JWT authentication", "Stripe", "Cloudinary", "Vercel"];

const About = () => {
    return (
        <div className="about-me-container">
            <div className="about-me-info">
                <h1 className="about-me-header">About VITBay</h1>
                <p className="about-me-text">
                    VITBay is a campus marketplace, an <span>eBay for college students</span>. It lets students
                    buy and sell things to each other: laptops, textbooks, cameras, clothes and hostel essentials,
                    without leaving campus.
                </p>
                <p className="about-me-text">
                    Built as a MERN-stack project by{" "}
                    <a href="https://github.com/PranavMahara" target="_blank" rel="noreferrer">Pranav Singh Mahara</a>.
                    Includes search and filters, listings with seller details, a cart, user accounts, image uploads and an admin panel.
                </p>
                <ul className="about-stack">
                    {stack.map((s) => <li key={s}>{s}</li>)}
                </ul>
                <p className="about-note">
                    This public deployment runs in demo mode with sample listings. Accounts, posting and payments are switched off.
                </p>
            </div>
        </div>
    );
};

export default About;
