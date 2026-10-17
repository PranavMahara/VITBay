import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FavoriteRounded from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRounded from "@mui/icons-material/FavoriteBorderRounded";
import PlaceOutlined from "@mui/icons-material/PlaceOutlined";
import PhotoLibraryOutlined from "@mui/icons-material/PhotoLibraryOutlined";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { errorMessage } from "../lib/api";
import { discount, rupees, timeAgo } from "../lib/format";
import { StatusPill } from "./ui";

export function SaveButton({ listingId, className = "" }) {
  const { user, isSaved, toggleSaved } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const saved = isSaved(listingId);

  const onClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return navigate(`/login?next=/listing/${listingId}`);
    setBusy(true);
    try {
      const now = await toggleSaved(listingId);
      toast.success(now ? "Saved. Find it under Saved items." : "Removed from saved items");
    } catch (err) {
      toast.error(errorMessage(err));
    }
    setBusy(false);
  };

  return (
    <button className={`save-btn ${saved ? "is-saved" : ""} ${className}`} onClick={onClick} disabled={busy} aria-pressed={saved} aria-label={saved ? "Remove from saved" : "Save"}>
      {saved ? <FavoriteRounded fontSize="small" /> : <FavoriteBorderRounded fontSize="small" />}
    </button>
  );
}

export default function ListingCard({ listing, showSeller = true }) {
  const off = discount(listing.price, listing.originalPrice);
  return (
    <Link to={`/listing/${listing._id}`} className={`card listing-card ${listing.status !== "active" ? "is-faded" : ""}`}>
      <div className="listing-img">
        <img src={listing.image} alt={listing.title} loading="lazy" />
        <div className="listing-img-top">
          <StatusPill status={listing.status} />
          {listing.price === 0 && listing.status === "active" && <span className="pill pill-free">Free</span>}
        </div>
        {listing.imageCount > 1 && (
          <span className="img-count">
            <PhotoLibraryOutlined fontSize="inherit" /> {listing.imageCount}
          </span>
        )}
        <SaveButton listingId={listing._id} className="on-image" />
      </div>
      <div className="listing-body">
        <div className="listing-price">
          <strong>{rupees(listing.price)}</strong>
          {off > 0 && <span className="strike">{rupees(listing.originalPrice)}</span>}
          {off > 0 && <span className="off">{off}% off</span>}
        </div>
        <h3 className="listing-title">{listing.title}</h3>
        <div className="listing-meta">
          <span className="cond">{listing.condition}</span>
          {listing.meetupSpot && (
            <span className="loc">
              <PlaceOutlined fontSize="inherit" />
              {listing.meetupSpot}
            </span>
          )}
        </div>
        <div className="listing-foot">
          {showSeller && listing.seller?.name ? <span className="truncate">{listing.seller.name}</span> : <span />}
          <span>{timeAgo(listing.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}

export function CardGridSkeleton({ count = 8 }) {
  return (
    <div className="grid">
      {Array.from({ length: count }, (_, i) => (
        <div className="card listing-card skeleton-card" key={i}>
          <div className="listing-img skel" />
          <div className="listing-body">
            <div className="skel skel-line" style={{ width: "40%" }} />
            <div className="skel skel-line" style={{ width: "85%" }} />
            <div className="skel skel-line" style={{ width: "60%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
