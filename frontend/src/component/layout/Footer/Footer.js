import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer id="footer">
            <div className="midFooter">
                <h1>VITBay</h1>
                <p>A marketplace made by students, for students. Buy, sell and pass things on within your campus.</p>

                <div className="rightFooter">
                    <Link to="/products">Browse</Link>
                    <Link to="/sell">Sell an item</Link>
                    <Link to="/about">About</Link>
                    <a href="https://github.com/PranavMahara/VITBay" target="_blank" rel="noreferrer">GitHub</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
