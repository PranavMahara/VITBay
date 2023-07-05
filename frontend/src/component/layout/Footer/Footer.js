import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer id="footer">
            <div className="midFooter">
                <h1>VITBay</h1>
                <p>For Customer Support: Contact Me!</p>

                <div className="rightFooter">
                    <Link to="#">Instagram</Link>
                    <Link to="#">Youtube</Link>
                    <Link to="#">Facebook</Link>
                </div>
            </div>

        </footer>
    );
};

export default Footer;