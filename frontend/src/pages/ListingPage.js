import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import PlaceOutlined from "@mui/icons-material/PlaceOutlined";
import ScheduleOutlined from "@mui/icons-material/ScheduleOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import FavoriteBorderRounded from "@mui/icons-material/FavoriteBorderRounded";
import ShareOutlined from "@mui/icons-material/ShareOutlined";
import FlagOutlined from "@mui/icons-material/FlagOutlined";
import ChatBubbleOutlineRounded from "@mui/icons-material/ChatBubbleOutlineRounded";
import LocalOfferOutlined from "@mui/icons-material/LocalOfferOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import ShieldOutlined from "@mui/icons-material/ShieldOutlined";
import ListingCard, { SaveButton } from "../components/ListingCard";
import { Avatar, ErrorState, Modal, SellerRating, Spinner, StatusPill, UserLink, Verified } from "../components/ui";
import { ListingStatusControls } from "./MyListings";
import { useApi, useTitle } from "../lib/hooks";
import api, { errorMessage } from "../lib/api";
import { categoryLabel, REPORT_REASONS } from "../lib/constants";
import { discount, firstName, lastSeen, memberSince, rupees, timeAgo } from "../lib/format";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function Gallery({ images, title }) {
  const [i, setI] = useState(0);
  useEffect(() => { setI(0); }, [images]);
  const go = (d) => setI((x) => (x + d + images.length) % images.length);
  return (
    <div className="gallery">
      <div className="gallery-main">
        <img src={images[i]?.url} alt={`${title} (${i + 1} of ${images.length})`} />
        {images.length > 1 && (
          <>
            <button className="gallery-nav prev" onClick={() => go(-1)} aria-label="Previous photo">
              <ChevronLeftRounded />
            </button>
            <button className="gallery-nav next" onClick={() => go(1)} aria-label="Next photo">
              <ChevronRightRounded />
            </button>
            <span className="gallery-count">
              {i + 1} / {images.length}
            </span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="thumbs">
          {images.map((img, n) => (
            <button key={img.url} className={n === i ? "active" : ""} onClick={() => setI(n)} aria-label={`Photo ${n + 1}`}>
              <img src={img.url} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ContactBox({ listing, seller, viewer }) {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [mode, setMode] = useState("message");
  const [text, setText] = useState(`Hi ${firstName(seller.name)}, is this still available?`);
  const [offer, setOffer] = useState(listing.price ? String(Math.round(listing.price * 0.9)) : "");
  const [busy, setBusy] = useState(false);

  if (viewer.conversationId) {
    return (
      <div className="contact-box">
        <p className="muted">You've already messaged {firstName(seller.name)} about this.</p>
        <Link to={`/inbox/${viewer.conversationId}`} className="btn btn-primary btn-block">
          <ChatBubbleOutlineRounded fontSize="small" /> Open conversation
        </Link>
      </div>
    );
  }

  if (listing.status === "sold") {
    return (
      <div className="contact-box">
        <p className="sold-note">This item has been sold.</p>
        <Link to={`/browse?category=${listing.category}`} className="btn btn-outline btn-block">
          See similar items
        </Link>
      </div>
    );
  }

  const send = async (e) => {
    e.preventDefault();
    if (!user) return navigate(`/login?next=/listing/${listing._id}`);
    setBusy(true);
    try {
      const body = mode === "offer" ? { listingId: listing._id, offer: Number(offer), text: text.trim() || undefined } : { listingId: listing._id, text };
      const { data } = await api.post("/conversations", body);
      toast.success(mode === "offer" ? "Offer sent" : "Message sent");
      navigate(`/inbox/${data.conversationId}`);
    } catch (err) {
      toast.error(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <form className="contact-box" onSubmit={send}>
      {listing.status === "reserved" && <p className="reserved-note">Reserved for another buyer, but you can still ask to be next in line.</p>}
      {listing.price > 0 && listing.negotiable && (
        <div className="segmented">
          <button type="button" className={mode === "message" ? "active" : ""} onClick={() => setMode("message")}>
            <ChatBubbleOutlineRounded fontSize="small" /> Message
          </button>
          <button type="button" className={mode === "offer" ? "active" : ""} onClick={() => setMode("offer")}>
            <LocalOfferOutlined fontSize="small" /> Make offer
          </button>
        </div>
      )}
      {mode === "offer" && (
        <label className="field">
          <span>Your offer</span>
          <div className="input-prefix">
            <span>₹</span>
            <input type="number" min="1" required value={offer} onChange={(e) => setOffer(e.target.value)} />
          </div>
          {Number(offer) > 0 && listing.price > 0 && (
            <small className="muted">{Math.round((1 - Number(offer) / listing.price) * 100)}% below the asking price</small>
          )}
        </label>
      )}
      <label className="field">
        <span>{mode === "offer" ? "Add a note (optional)" : `Message ${firstName(seller.name)}`}</span>
        <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} required={mode === "message"} maxLength={1000} />
      </label>
      <button className="btn btn-primary btn-block" disabled={busy}>
        {busy ? "Sending…" : mode === "offer" ? `Send offer of ${offer ? rupees(Number(offer)) : "…"}` : "Send message"}
      </button>
      {!user && <p className="muted small center">You'll be asked to log in first.</p>}
    </form>
  );
}

function ReportButton({ listingId }) {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/listings/${listingId}/report`, { reason, details });
      toast.success(data.message);
      setOpen(false);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <>
      <button className="link-btn muted" onClick={() => (user ? setOpen(true) : navigate(`/login?next=/listing/${listingId}`))}>
        <FlagOutlined fontSize="inherit" /> Report listing
      </button>
      {open && (
        <Modal title="Report this listing" onClose={() => setOpen(false)}>
          <form onSubmit={submit} className="stack">
            {REPORT_REASONS.map((r) => (
              <label className="radio" key={r}>
                <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} /> {r}
              </label>
            ))}
            <label className="field">
              <span>Anything else we should know?</span>
              <textarea rows={3} maxLength={500} value={details} onChange={(e) => setDetails(e.target.value)} />
            </label>
            <button className="btn btn-primary">Send report</button>
          </form>
        </Modal>
      )}
    </>
  );
}

function ReviewPrompt({ listing, seller, onDone }) {
  const toast = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/reviews", { listingId: listing._id, rating, comment });
      toast.success("Thanks for the review!");
      onDone();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };
  return (
    <form className="panel review-prompt" onSubmit={submit}>
      <h3>How was buying from {firstName(seller.name)}?</h3>
      <div className="rate-picker" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button type="button" key={n} className={n <= rating ? "on" : ""} onClick={() => setRating(n)} aria-label={`${n} stars`}>
            ★
          </button>
        ))}
      </div>
      <textarea rows={2} placeholder="Was the item as described? Were they on time?" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={500} />
      <button className="btn btn-primary">Post review</button>
    </form>
  );
}

export default function ListingPage() {
  const { id } = useParams();
  const toast = useToast();
  const { data, loading, error, reload, setData } = useApi(`/listings/${id}`);
  const similar = useApi(`/listings/${id}/similar`);
  useTitle(data?.listing?.title || "Listing");

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (loading && !data) return <Spinner />;
  if (error) return <main className="container narrow"><ErrorState message={error} onRetry={reload} /></main>;

  const { listing, seller, viewer } = data;
  const off = discount(listing.price, listing.originalPrice);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: listing.title, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch (_) {
      /* share sheet dismissed */
    }
  };

  return (
    <main className="container listing-page">
      <nav className="crumbs">
        <Link to="/browse">All items</Link> / <Link to={`/browse?category=${listing.category}`}>{categoryLabel(listing.category)}</Link>
      </nav>

      <div className="listing-layout">
        <div className="listing-main">
          <Gallery images={listing.images} title={listing.title} />

          <section className="panel listing-description">
            <h2>Description</h2>
            <p className="description">{listing.description}</p>
            <dl className="facts">
              <div>
                <dt>Condition</dt>
                <dd>{listing.condition}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{categoryLabel(listing.category)}</dd>
              </div>
              {listing.meetupSpot && (
                <div>
                  <dt>Meet at</dt>
                  <dd>{listing.meetupSpot}</dd>
                </div>
              )}
              <div>
                <dt>Price</dt>
                <dd>{listing.price === 0 ? "Free" : listing.negotiable ? "Open to offers" : "Fixed price"}</dd>
              </div>
            </dl>
          </section>
        </div>

        <aside className="listing-side">
          <section className="panel">
            <div className="title-row">
              <h1>{listing.title}</h1>
              {!viewer.isOwner && <SaveButton listingId={listing._id} className="save-lg" />}
            </div>
            <div className="price-row">
              <span className="price">{rupees(listing.price)}</span>
              {off > 0 && (
                <>
                  <span className="strike">{rupees(listing.originalPrice)} new</span>
                  <span className="off">{off}% off</span>
                </>
              )}
              <StatusPill status={listing.status} />
            </div>
            <div className="meta-row">
              {listing.meetupSpot && (
                <span>
                  <PlaceOutlined fontSize="inherit" /> {listing.meetupSpot}
                </span>
              )}
              <span>
                <ScheduleOutlined fontSize="inherit" /> Listed {timeAgo(listing.createdAt)}
              </span>
              <span>
                <VisibilityOutlined fontSize="inherit" /> {listing.views} views
              </span>
              {listing.saves > 0 && (
                <span>
                  <FavoriteBorderRounded fontSize="inherit" /> {listing.saves} saved
                </span>
              )}
            </div>

            {viewer.isOwner ? (
              <div className="owner-box">
                <p className="muted">This is your listing.</p>
                <div className="owner-actions">
                  <Link to={`/listing/${listing._id}/edit`} className="btn btn-outline">
                    <EditOutlined fontSize="small" /> Edit
                  </Link>
                  <ListingStatusControls listing={listing} onChange={(l) => setData((d) => ({ ...d, listing: { ...d.listing, ...l } }))} />
                </div>
              </div>
            ) : (
              <ContactBox listing={listing} seller={seller} viewer={viewer} />
            )}
          </section>

          {viewer.canReview && <ReviewPrompt listing={listing} seller={seller} onDone={reload} />}

          <section className="panel seller-card">
            <UserLink user={seller} className="seller-head">
              <Avatar user={seller} size={52} />
              <div>
                <strong>
                  {seller.name} <Verified user={seller} />
                </strong>
                <SellerRating rating={seller.rating} />
              </div>
            </UserLink>
            <ul className="seller-facts">
              {seller.hostel && <li>{seller.hostel}</li>}
              {seller.course && <li>{seller.course}</li>}
              <li>On VITBay since {memberSince(seller.createdAt)}</li>
              <li>
                {seller.activeListings} for sale · {seller.sold} sold
              </li>
              <li className="online">{lastSeen(seller.lastActiveAt)}</li>
            </ul>
            <UserLink user={seller} className="btn btn-outline btn-block">
              View profile
            </UserLink>
          </section>

          <section className="panel safety-mini">
            <ShieldOutlined />
            <div>
              <strong>Meet on campus, in daylight.</strong>
              <p className="muted">Check the item before you pay. Never pay in advance or share OTPs. <Link to="/safety">More safety tips</Link></p>
            </div>
          </section>

          <div className="listing-tools">
            <button className="link-btn muted" onClick={share}>
              <ShareOutlined fontSize="inherit" /> Share
            </button>
            {!viewer.isOwner && <ReportButton listingId={listing._id} />}
          </div>
        </aside>
      </div>

      {similar.data?.listings?.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>More in {categoryLabel(listing.category)}</h2>
          </div>
          <div className="grid">
            {similar.data.listings.slice(0, 4).map((l) => (
              <ListingCard key={l._id} listing={l} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
