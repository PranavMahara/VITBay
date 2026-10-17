import React from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../lib/constants";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="logo logo-light">
            VIT<span>Bay</span>
          </Link>
          <p>Buy and sell with students on your campus. Meet in person, pay how you like, keep things out of landfill.</p>
        </div>
        <div>
          <h4>Shop</h4>
          {CATEGORIES.slice(0, 6).map((c) => (
            <Link key={c.slug} to={`/browse?category=${c.slug}`}>
              {c.label}
            </Link>
          ))}
        </div>
        <div>
          <h4>Sell</h4>
          <Link to="/sell">Post a listing</Link>
          <Link to="/my/listings">My listings</Link>
          <Link to="/inbox">Messages</Link>
        </div>
        <div>
          <h4>VITBay</h4>
          <Link to="/about">About</Link>
          <Link to="/safety">Safety tips</Link>
          <Link to="/guidelines">Community guidelines</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} VITBay. A student-run project, not affiliated with VIT.</span>
        <span>
          Made in Vellore · <Link to="/about">Contact</Link>
        </span>
      </div>
    </footer>
  );
}
