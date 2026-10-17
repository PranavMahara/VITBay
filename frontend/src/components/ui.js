import React, { useEffect } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import StarRounded from "@mui/icons-material/StarRounded";
import StarHalfRounded from "@mui/icons-material/StarHalfRounded";
import StarOutlineRounded from "@mui/icons-material/StarOutlineRounded";
import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import { useAuth } from "../context/AuthContext";

const AVATAR_COLORS = ["#e4572e", "#2f7d6d", "#3d5a80", "#9c6644", "#7b5ea7", "#c08a1e", "#3f7cac", "#b5485d"];

export function Avatar({ user, size = 40 }) {
  const name = user?.name || "?";
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const color = AVATAR_COLORS[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length];
  const style = { width: size, height: size, fontSize: size * 0.38 };
  if (user?.avatar?.url) {
    return <img className="avatar" src={user.avatar.url} alt="" style={style} loading="lazy" />;
  }
  return (
    <span className="avatar" style={{ ...style, background: color }} aria-hidden="true">
      {initials}
    </span>
  );
}

export function Verified({ user, withText = false }) {
  if (!user?.verified) return null;
  return (
    <span className="verified" title="Signed up with a VIT email address">
      <VerifiedRounded fontSize="inherit" />
      {withText && <span>VIT verified</span>}
    </span>
  );
}

export function Stars({ value = 0, size = "small" }) {
  return (
    <span className="stars" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) =>
        value >= i ? (
          <StarRounded key={i} fontSize={size} />
        ) : value >= i - 0.5 ? (
          <StarHalfRounded key={i} fontSize={size} />
        ) : (
          <StarOutlineRounded key={i} fontSize={size} className="star-empty" />
        )
      )}
    </span>
  );
}

export function SellerRating({ rating }) {
  if (!rating?.count) return <span className="muted">No reviews yet</span>;
  return (
    <span className="seller-rating">
      <StarRounded fontSize="inherit" className="star-solid" />
      <strong>{rating.average.toFixed(1)}</strong>
      <span className="muted">({rating.count} review{rating.count > 1 ? "s" : ""})</span>
    </span>
  );
}

export function Spinner({ label }) {
  return (
    <div className="spinner-wrap" role="status">
      <span className="spinner" />
      {label && <span className="muted">{label}</span>}
    </div>
  );
}

export function Empty({ icon, title, children, action }) {
  return (
    <div className="empty">
      {icon && <div className="empty-icon">{icon}</div>}
      <h3>{title}</h3>
      {children && <p className="muted">{children}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <Empty title="Couldn't load this" action={onRetry && <button className="btn btn-outline" onClick={onRetry}>Try again</button>}>
      {message}
    </Empty>
  );
}

export function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.classList.add("no-scroll");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("no-scroll");
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${wide ? "modal-wide" : ""}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <CloseRounded />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function RequireAuth({ children }) {
  const { user, ready } = useAuth();
  const location = useLocation();
  if (!ready) return <Spinner />;
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  return children;
}

export function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  const nums = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(pages, page + 2); i++) nums.push(i);
  return (
    <nav className="pagination" aria-label="Pages">
      <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Previous
      </button>
      {nums[0] > 1 && <span className="muted">…</span>}
      {nums.map((n) => (
        <button key={n} className={`page-num ${n === page ? "active" : ""}`} onClick={() => onChange(n)} aria-current={n === page}>
          {n}
        </button>
      ))}
      {nums[nums.length - 1] < pages && <span className="muted">…</span>}
      <button className="btn btn-outline btn-sm" disabled={page >= pages} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </nav>
  );
}

export function UserLink({ user, children, className = "" }) {
  if (!user?._id) return <span className={className}>{children}</span>;
  return (
    <Link to={`/u/${user._id}`} className={className}>
      {children}
    </Link>
  );
}

export function StatusPill({ status }) {
  if (!status || status === "active") return null;
  return <span className={`pill pill-${status}`}>{status === "sold" ? "Sold" : "Reserved"}</span>;
}
