import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SendRounded from "@mui/icons-material/SendRounded";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import LocalOfferOutlined from "@mui/icons-material/LocalOfferOutlined";
import ForumOutlined from "@mui/icons-material/ForumOutlined";
import { Avatar, Empty, ErrorState, Spinner, StatusPill, UserLink, Verified } from "../components/ui";
import { useApi, useInterval, useTitle } from "../lib/hooks";
import api, { errorMessage } from "../lib/api";
import { clockTime, dayLabel, firstName, lastSeen, rupees, shortDate } from "../lib/format";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function ConversationList({ conversations, activeId }) {
  const { user } = useAuth();
  if (!conversations.length) {
    return (
      <Empty icon={<ForumOutlined />} title="No messages yet" action={<Link to="/browse" className="btn btn-primary">Browse items</Link>}>
        When you message a seller, or someone asks about your listing, it shows up here.
      </Empty>
    );
  }
  return (
    <ul className="convo-list">
      {conversations.map((c) => (
        <li key={c._id}>
          <Link to={`/inbox/${c._id}`} className={`convo-item ${c._id === activeId ? "active" : ""} ${c.unread ? "unread" : ""}`}>
            <div className="convo-thumb">
              <img src={c.listing?.image} alt="" />
              <span className="convo-avatar">
                <Avatar user={c.other} size={24} />
              </span>
            </div>
            <div className="convo-text">
              <div className="convo-top">
                <strong className="truncate">{c.other?.name}</strong>
                <span className="muted small">{c.lastMessage?.at && shortDate(c.lastMessage.at)}</span>
              </div>
              <div className="truncate small convo-listing">{c.listing?.title}</div>
              <div className="truncate small muted">
                {String(c.lastMessage?.sender) === user._id ? "You: " : ""}
                {c.lastMessage?.text}
              </div>
            </div>
            {c.unread > 0 && <span className="dot-badge">{c.unread}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function OfferBubble({ m, mine, role, onRespond }) {
  const status = m.offer.status;
  return (
    <div className={`offer-card ${status}`}>
      <div className="offer-label">
        <LocalOfferOutlined fontSize="inherit" /> {mine ? "Your offer" : "Offer"}
      </div>
      <div className="offer-amount">{rupees(m.offer.amount)}</div>
      {m.text && <p>{m.text}</p>}
      {status === "pending" && role === "seller" && !mine && (
        <div className="offer-actions">
          <button className="btn btn-primary btn-sm" onClick={() => onRespond(m._id, "accept")}>
            Accept
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => onRespond(m._id, "decline")}>
            Decline
          </button>
        </div>
      )}
      {status === "pending" && mine && (
        <button className="link-btn small" onClick={() => onRespond(m._id, "withdraw")}>
          Withdraw offer
        </button>
      )}
      {status !== "pending" && <div className={`offer-status ${status}`}>{status[0].toUpperCase() + status.slice(1)}</div>}
    </div>
  );
}

function Thread({ id, onActivity }) {
  const { user, refreshUnread } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [convo, setConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [text, setText] = useState("");
  const [offerMode, setOfferMode] = useState(false);
  const [offer, setOffer] = useState("");
  const [sending, setSending] = useState(false);
  const bottom = useRef(null);
  const lastAt = useRef(null);

  const load = useCallback(
    async (initial) => {
      try {
        const after = !initial && lastAt.current ? `?after=${encodeURIComponent(lastAt.current)}` : "";
        const { data } = await api.get(`/conversations/${id}${after}`);
        setConvo(data.conversation);
        if (data.messages.length) {
          lastAt.current = data.messages[data.messages.length - 1].createdAt;
          setMessages((prev) => {
            const merged = initial ? data.messages : [...prev, ...data.messages];
            const seen = new Set();
            return merged.filter((m) => !seen.has(m._id) && seen.add(m._id));
          });
          if (!initial) onActivity();
        }
        refreshUnread();
      } catch (err) {
        if (initial) setError(errorMessage(err));
      }
    },
    [id, onActivity, refreshUnread]
  );

  useEffect(() => {
    setConvo(null);
    setMessages([]);
    setError(null);
    lastAt.current = null;
    load(true);
  }, [id, load]);

  useInterval(() => load(false), 4000, Boolean(convo));

  useLayoutEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const send = async (e) => {
    e.preventDefault();
    if (sending) return;
    const body = offerMode ? { offer: Number(offer), text: text.trim() || undefined } : { text: text.trim() };
    if (!offerMode && !body.text) return;
    setSending(true);
    try {
      await api.post(`/conversations/${id}/messages`, body);
      setText("");
      setOffer("");
      setOfferMode(false);
      await load(false);
      onActivity();
    } catch (err) {
      toast.error(errorMessage(err));
    }
    setSending(false);
  };

  const respond = async (messageId, action) => {
    try {
      await api.patch(`/conversations/${id}/offers/${messageId}`, { action });
      setMessages((ms) => ms.map((m) => (m._id === messageId ? { ...m, offer: { ...m.offer, status: { accept: "accepted", decline: "declined", withdraw: "withdrawn" }[action] } } : m)));
      await load(false);
      onActivity();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  if (error) return <ErrorState message={error} />;
  if (!convo) return <Spinner />;

  const { other, listing, role } = convo;
  let lastDay = null;

  return (
    <div className="thread">
      <div className="thread-head">
        <button className="icon-btn show-sm" onClick={() => navigate("/inbox")} aria-label="Back to messages">
          <ArrowBackRounded />
        </button>
        <UserLink user={other} className="thread-person">
          <Avatar user={other} size={38} />
          <div>
            <strong>
              {other?.name} <Verified user={other} />
            </strong>
            <span className="muted small">{lastSeen(other?.lastActiveAt)}</span>
          </div>
        </UserLink>
      </div>

      {listing && (
        <Link to={`/listing/${listing._id}`} className="thread-listing">
          <img src={listing.image} alt="" />
          <div>
            <div className="truncate">{listing.title}</div>
            <strong>{rupees(listing.price)}</strong> <StatusPill status={listing.status} />
          </div>
          <span className="muted small">{role === "seller" ? "Your listing" : `${firstName(other?.name)}'s listing`}</span>
        </Link>
      )}

      <div className="messages">
        {messages.map((m) => {
          const mine = m.sender === user._id;
          const day = dayLabel(m.createdAt);
          const divider = day !== lastDay ? <div className="day-divider" key={`d${m._id}`}><span>{day}</span></div> : null;
          lastDay = day;
          if (m.kind === "system") {
            return (
              <React.Fragment key={m._id}>
                {divider}
                <div className="system-msg">
                  {mine ? "You" : firstName(other?.name)} {m.text}
                </div>
              </React.Fragment>
            );
          }
          return (
            <React.Fragment key={m._id}>
              {divider}
              <div className={`msg ${mine ? "mine" : "theirs"}`}>
                {m.kind === "offer" ? <OfferBubble m={m} mine={mine} role={role} onRespond={respond} /> : <div className="bubble">{m.text}</div>}
                <span className="msg-time">{clockTime(m.createdAt)}</span>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={bottom} />
      </div>

      {listing?.status === "sold" && listing.buyer !== user._id && role === "buyer" ? (
        <div className="thread-closed muted">This item has been sold to someone else.</div>
      ) : (
        <form className="composer" onSubmit={send}>
          {offerMode && (
            <div className="composer-offer">
              <span>Offer</span>
              <div className="input-prefix">
                <span>₹</span>
                <input type="number" min="1" value={offer} onChange={(e) => setOffer(e.target.value)} autoFocus required placeholder={String(listing?.price || "")} />
              </div>
              <button type="button" className="link-btn small" onClick={() => setOfferMode(false)}>
                Cancel
              </button>
            </div>
          )}
          <div className="composer-row">
            {role === "buyer" && !offerMode && listing?.status !== "sold" && listing?.price > 0 && (
              <button type="button" className="icon-btn" onClick={() => setOfferMode(true)} title="Make an offer" aria-label="Make an offer">
                <LocalOfferOutlined />
              </button>
            )}
            <textarea
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) send(e);
              }}
              placeholder={offerMode ? "Add a note (optional)" : "Write a message…"}
              maxLength={1000}
              aria-label="Message"
            />
            <button className="btn btn-primary send-btn" disabled={sending || (!offerMode && !text.trim())} aria-label="Send">
              <SendRounded fontSize="small" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function Inbox() {
  useTitle("Messages");
  const { id } = useParams();
  const { data, loading, error, reload } = useApi("/conversations");
  useInterval(reload, 15000);

  const refresh = useCallback(() => reload(), [reload]);

  return (
    <main className="container inbox-page">
      <div className={`inbox ${id ? "has-thread" : ""}`}>
        <aside className="inbox-list">
          <h1>Messages</h1>
          {loading && !data ? <Spinner /> : error ? <ErrorState message={error} onRetry={reload} /> : <ConversationList conversations={data.conversations} activeId={id} />}
        </aside>
        <section className="inbox-thread">
          {id ? (
            <Thread id={id} onActivity={refresh} />
          ) : (
            <div className="thread-placeholder">
              <ForumOutlined />
              <p className="muted">Pick a conversation to read it.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
