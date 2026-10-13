import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import CartIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonIcon from "@mui/icons-material/PersonOutline";
import UserOptions from "../Header/UserOptions";
import "./NavBar.css";

function NavBar() {
    const [open, setOpen] = useState(false);
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const { cartItems } = useSelector((state) => state.cart);

    const close = () => setOpen(false);
    const link = ({ isActive }) => "vb-link" + (isActive ? " active" : "");

    return (
        <header className="vb-nav">
            <div className="vb-nav-inner">
                <Link to="/" className="vb-logo" onClick={close}>
                    <span className="vb-logo-mark">V</span>
                    <span>VIT<b>Bay</b></span>
                </Link>

                <nav className={"vb-menu" + (open ? " open" : "")}>
                    <NavLink to="/" end className={link} onClick={close}>Home</NavLink>
                    <NavLink to="/products" className={link} onClick={close}>Shop</NavLink>
                    <NavLink to="/about" className={link} onClick={close}>About</NavLink>
                </nav>

                <div className="vb-actions">
                    <Link to="/search" className="vb-icon" aria-label="Search" onClick={close}><SearchIcon /></Link>
                    <Link to={isAuthenticated ? "/account" : "/login"} className="vb-icon" aria-label="Account" onClick={close}><PersonIcon /></Link>
                    <Link to="/cart" className="vb-icon" aria-label="Cart" onClick={close}>
                        <CartIcon />
                        {cartItems.length > 0 && <span className="vb-badge">{cartItems.length}</span>}
                    </Link>
                    <button className="vb-burger" aria-label="Menu" onClick={() => setOpen(!open)}>
                        {open ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>
            </div>
            {isAuthenticated && <UserOptions user={user} />}
        </header>
    );
}

export default NavBar;
