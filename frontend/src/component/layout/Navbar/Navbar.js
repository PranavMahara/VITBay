import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import UserOptions from "../Header/UserOptions";
import { useSelector } from "react-redux";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

function NavBar() {
    const [click, setClick] = useState(false);
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const { cartItems } = useSelector((state) => state.cart);

    const close = () => setClick(false);
    return (
        <>
            <nav className="navbar">
                <div className="nav-container">
                    <Link to="/" className="nav-logo" onClick={close}>
                        VITBay
                        <span className="nav-tag">campus marketplace</span>
                    </Link>

                    <ul className={"nav-menu" + (isAuthenticated ? " nav-menu-profile" : "") + (click ? " active" : "")}>
                        <li className="nav-item">
                            <Link to="/products" className="nav-links" onClick={close}>Browse</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/search" className="nav-links" onClick={close}>Search</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/about" className="nav-links" onClick={close}>About</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/cart" className="nav-links" onClick={close}>
                                Cart{cartItems.length > 0 ? ` (${cartItems.length})` : ""}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={isAuthenticated ? "/account" : "/login"} className="nav-links" onClick={close}>
                                {isAuthenticated ? "Profile" : "Login"}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/sell" className="nav-links nav-sell" onClick={close}>Sell an item</Link>
                        </li>

                        {isAuthenticated && <UserOptions user={user} />}
                    </ul>
                    <div className="nav-icon" onClick={() => setClick(!click)}>
                        {click ? <CloseIcon fontSize="inherit" /> : <MenuIcon fontSize="inherit" />}
                    </div>
                </div>
            </nav>
        </>
    );
}

export default NavBar;
