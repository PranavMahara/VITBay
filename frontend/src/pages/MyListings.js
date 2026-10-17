import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddRounded from "@mui/icons-material/AddRounded";
import Inventory2Outlined from "@mui/icons-material/Inventory2Outlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import FavoriteBorderRounded from "@mui/icons-material/FavoriteBorderRounded";
import ChatBubbleOutlineRounded from "@mui/icons-material/ChatBubbleOutlineRounded";
import { Avatar, Empty, ErrorState, Modal, Spinner, StatusPill } from "../components/ui";
import { useApi, useTitle } from "../lib/hooks";
import api, { errorMessage } from "../lib/api";
import { rupees, timeAgo } from "../lib/format";
import { useToast } from "../context/ToastContext";

function SoldDialog({ listing, onClose, onSold }) {
  const { data, loading } = useApi(`/listings/${listing._id}/buyers`);
  const [buyer, setBuyer] = useState("");
  return (
    <Modal title="Who bought it?" onClose={onClose}>
      <p className="muted">Picking the buyer lets them leave you a review. You can skip this if you sold it outside VITBay.</p>
      {loading ? (
        <Spinner />
      ) : (
        <div className="stack">
          {data?.buyers?.map((b) => (
            <label className={`buyer-option ${buyer === b._id ? "active" : ""}`} key={b._id}>
              <input type="radio" name="buyer" checked={buyer === b._id} onChange={() => setBuyer(b._id)} />
              <Avatar user={b} size={32} />
              <span>{b.name}</span>
            </label>
          ))}
          <label className={`buyer-option ${buyer === "" ? "active" : ""}`}>
            <input type="radio" name="buyer" checked={buyer === ""} onChange={() => setBuyer("")} />
            <span>Someone else / not on VITBay</span>
          </label>
          <button className="btn btn-primary" onClick={() => onSold(buyer)}>
            Mark as sold
          </button>
        </div>
      )}
    </Modal>
  );
}

// Reserve / sell / relist / delete controls, shared by the listing page and My listings
export function ListingStatusControls({ listing, onChange, onDeleted }) {
  const toast = useToast();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [soldOpen, setSoldOpen] = useState(false);

  const setStatus = async (status, buyer) => {
    setBusy(true);
    try {
      const { data } = await api.patch(`/listings/${listing._id}/status`, { status, buyer: buyer || undefined });
      onChange(data.listing);
      toast.success(status === "sold" ? "Marked as sold. Nice one!" : status === "reserved" ? "Marked as reserved" : "Back on sale");
    } catch (err) {
      toast.error(errorMessage(err));
    }
    setBusy(false);
    setSoldOpen(false);
  };

  const remove = async () => {
    if (!window.confirm("Delete this listing? Its conversations will be removed too.")) return;
    setBusy(true);
    try {
      await api.delete(`/listings/${listing._id}`);
      toast.success("Listing deleted");
      if (onDeleted) onDeleted(listing._id);
      else navigate("/my/listings");
    } catch (err) {
      toast.error(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <>
      {listing.status === "active" && (
        <button className="btn btn-outline" disabled={busy} onClick={() => setStatus("reserved")}>
          Mark reserved
        </button>
      )}
      {listing.status !== "sold" && (
        <button className="btn btn-dark" disabled={busy} onClick={() => setSoldOpen(true)}>
          Mark sold
        </button>
      )}
      {listing.status !== "active" && (
        <button className="btn btn-outline" disabled={busy} onClick={() => setStatus("active")}>
          {listing.status === "sold" ? "Relist" : "Back on sale"}
        </button>
      )}
      <button className="btn btn-ghost-danger" disabled={busy} onClick={remove}>
        Delete
      </button>
      {soldOpen && <SoldDialog listing={listing} onClose={() => setSoldOpen(false)} onSold={(buyer) => setStatus("sold", buyer)} />}
    </>
  );
}

const TABS = [
  ["active", "On sale"],
  ["reserved", "Reserved"],
  ["sold", "Sold"],
];

export default function MyListings() {
  useTitle("My listings");
  const { data, loading, error, reload, setData } = useApi("/me/listings");
  const [tab, setTab] = useState("active");

  if (loading && !data) return <Spinner />;
  if (error) return <main className="container narrow"><ErrorState message={error} onRetry={reload} /></main>;

  const all = data.listings;
  const shown = all.filter((l) => l.status === tab);
  const update = (l) => setData((d) => ({ ...d, listings: d.listings.map((x) => (x._id === l._id ? { ...x, ...l } : x)) }));
  const removed = (id) => setData((d) => ({ ...d, listings: d.listings.filter((x) => x._id !== id) }));

  return (
    <main className="container page">
      <div className="page-head">
        <h1>My listings</h1>
        <Link to="/sell" className="btn btn-primary">
          <AddRounded fontSize="small" /> New listing
        </Link>
      </div>
      <div className="tabs">
        {TABS.map(([key, label]) => (
          <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>
            {label} <span className="tab-count">{all.filter((l) => l.status === key).length}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <Empty icon={<Inventory2Outlined />} title={tab === "active" ? "Nothing on sale right now" : `No ${tab} items`} action={tab === "active" && <Link to="/sell" className="btn btn-primary">Sell something</Link>}>
          {tab === "active" ? "That old calculator in your drawer could be someone's exam-day saviour." : null}
        </Empty>
      ) : (
        <div className="manage-list">
          {shown.map((l) => (
            <div className="manage-row panel" key={l._id}>
              <Link to={`/listing/${l._id}`} className="manage-img">
                <img src={l.image} alt="" />
              </Link>
              <div className="manage-info">
                <Link to={`/listing/${l._id}`} className="manage-title">
                  {l.title}
                </Link>
                <div className="manage-price">
                  {rupees(l.price)} <StatusPill status={l.status} />
                </div>
                <div className="manage-stats muted">
                  <span>
                    <VisibilityOutlined fontSize="inherit" /> {l.views}
                  </span>
                  <span>
                    <FavoriteBorderRounded fontSize="inherit" /> {l.saves}
                  </span>
                  <span>
                    <ChatBubbleOutlineRounded fontSize="inherit" /> {l.chats}
                  </span>
                  <span>Listed {timeAgo(l.createdAt)}</span>
                </div>
              </div>
              <div className="manage-actions">
                <Link to={`/listing/${l._id}/edit`} className="btn btn-outline">
                  Edit
                </Link>
                <ListingStatusControls listing={l} onChange={update} onDeleted={removed} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
