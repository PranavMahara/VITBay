import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="vb-footer">
            <div className="vb-footer-inner">
                <div className="vb-footer-brand">
                    <h3>VIT<b>Bay</b></h3>
                    <p>A full-stack MERN e-commerce project: product catalogue, search and filters, cart, authentication, reviews and an admin dashboard.</p>
                </div>
                <div>
                    <h4>Shop</h4>
                    <Link to="/products">All products</Link>
                    <Link to="/products?category=Laptop">Laptops</Link>
                    <Link to="/products?category=SmartPhones">Smartphones</Link>
                    <Link to="/products?category=Camera">Cameras</Link>
                </div>
                <div>
                    <h4>Explore</h4>
                    <Link to="/search">Search</Link>
                    <Link to="/cart">Cart</Link>
                    <Link to="/about">About the project</Link>
                </div>
                <div>
                    <h4>Project</h4>
                    <a href="https://github.com/PranavMahara/VITBay" target="_blank" rel="noreferrer">Source on GitHub</a>
                    <a href="https://github.com/PranavMahara" target="_blank" rel="noreferrer">Pranav Singh Mahara</a>
                </div>
            </div>
            <div className="vb-footer-bottom">© {new Date().getFullYear()} VITBay · Built with React, Redux, Node, Express and MongoDB</div>
        </footer>
    );
};

export default Footer;
