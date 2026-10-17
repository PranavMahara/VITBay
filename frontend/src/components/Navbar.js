import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import SearchRounded from "@mui/icons-material/SearchRounded";
import ChatBubbleOutlineRounded from "@mui/icons-material/ChatBubbleOutlineRounded";
import FavoriteBorderRounded from "@mui/icons-material/FavoriteBorderRounded";
import AddRounded from "@mui/icons-material/AddRounded";
import Inventory2Outlined from "@mui/icons-material/Inventory2Outlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import PersonOutlineRounded from "@mui/icons-material/PersonOutlineRounded";
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import { useAuth } from "../context/AuthContext";
import { Avatar } from "./ui";
import { CATEGORIES } from "../lib/constants";

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="VITBay home">
      VIT<span>Bay</span>
    </Link>
  );
}

function SearchBox() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [q, setQ] = useState("");

  useEffect(() => {
    setQ(location.pathname === "/browse" ? params.get("q") || "" : "");
  }, [location.pathname, params]);

  const submit = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(location.pathname === "/browse" ? params : undefined);
    if (q.trim()) next.set("q", q.trim());
    else next.delete("q");
    next.delete("page");
    navigate(`/browse?${next.toString()}`);
  };

  return (
    <form className="nav-search" onSubmit={submit} role="search">
      <SearchRounded className="nav-search-icon" />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search calculators, cycles, textbooks…" aria-label="Search listings" />
    </form>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location]);
  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="user-menu" ref={ref}>
      <button className="avatar-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Account menu">
        <Avatar user={user} size={34} />
      </button>
      {open && (
        <div className="dropdown">
          <div className="dropdown-head">
            <strong>{user.name}</strong>
            <span className="muted truncate">{user.email}</span>
          </div>
          <Link to={`/u/${user._id}`}>
            <PersonOutlineRounded fontSize="small" /> Public profile
          </Link>
          <Link to="/my/listings">
            <Inventory2Outlined fontSize="small" /> My listings
          </Link>
          <Link to="/saved">
            <FavoriteBorderRounded fontSize="small" /> Saved items
          </Link>
          <Link to="/settings">
            <SettingsOutlined fontSize="small" /> Settings
          </Link>
          <button
            onClick={async () => {
              await logout();
              navigate("/");
            }}
          >
            <LogoutRounded fontSize="small" /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { user, ready, unread } = useAuth();
  const location = useLocation();
  const showCats = location.pathname === "/" || location.pathname === "/browse";
  const [params] = useSearchParams();
  const activeCat = location.pathname === "/browse" ? params.get("category") : null;

  return (
    <header className="nav">
      <div className="nav-main container">
        <Logo />
        <SearchBox />
        <nav className="nav-actions">
          {ready && user && (
            <>
              <NavLink to="/inbox" className="nav-icon" aria-label="Messages" title="Messages">
                <ChatBubbleOutlineRounded />
                {unread > 0 && <span className="badge">{unread > 9 ? "9+" : unread}</span>}
              </NavLink>
              <NavLink to="/saved" className="nav-icon hide-sm" aria-label="Saved items" title="Saved items">
                <FavoriteBorderRounded />
              </NavLink>
            </>
          )}
          {ready && !user && (
            <Link to="/login" className="nav-link">
              Log in
            </Link>
          )}
          <Link to="/sell" className="btn btn-primary btn-sell">
            <AddRounded fontSize="small" />
            <span>Sell</span>
          </Link>
          {ready && user && <UserMenu />}
        </nav>
      </div>
      {showCats && (
        <div className="nav-cats">
          <div className="container nav-cats-inner">
            <Link to="/browse" className={location.pathname === "/browse" && !activeCat ? "active" : ""}>
              All items
            </Link>
            {CATEGORIES.filter((c) => c.slug !== "other").map((c) => (
              <Link key={c.slug} to={`/browse?category=${c.slug}`} className={activeCat === c.slug ? "active" : ""}>
                {c.short}
              </Link>
            ))}
            <Link to="/browse?free=1" className={params.get("free") === "1" ? "active" : ""}>
              Free stuff
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
