import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import UserOptions from "../Header/UserOptions";
import { useSelector } from "react-redux";

function NavBar() {
    const [click, setClick] = useState(false);
    const { isAuthenticated, user } = useSelector((state) => state.user);
    

    const handleClick = () => setClick(!click);
    return (
        <>
            <nav className="navbar">
                <div className="nav-container">
                    <Link to="/" className="nav-logo">
                        VITBay
                        <i className="fas fa-code"></i>
                    </Link>

                    <ul className={isAuthenticated ? "nav-menu nav-menu-profile" : "nav-menu"}>
                        <li className="nav-item">
                            <Link
                                to="/products"
                                className="nav-links"
                                onClick={handleClick}
                            >
                                All Products
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="/Login"
                                className="nav-links"
                                onClick={handleClick}
                            >
                                Profile
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="/cart"
                                className="nav-links"
                                onClick={handleClick}
                            >
                                Cart
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="/search"
                                className="nav-links"
                                onClick={handleClick}
                            >
                                Search
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="/about"
                                className="nav-links"
                                onClick={handleClick}
                            >
                                About Me
                            </Link>
                        </li>

                        {isAuthenticated && <UserOptions user={user} />}
                        
                    </ul>
                    <div className="nav-icon" onClick={handleClick}>
                        <i className={click ? "fas fa-times" : "fas fa-bars"}></i>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default NavBar;