import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import StorefrontOutlined from "@mui/icons-material/StorefrontOutlined";
import RateReviewOutlined from "@mui/icons-material/RateReviewOutlined";
import ListingCard from "../components/ListingCard";
import { Avatar, Empty, ErrorState, SellerRating, Spinner, Stars, UserLink, Verified } from "../components/ui";
import { useApi, useTitle } from "../lib/hooks";
import { lastSeen, memberSince, timeAgo } from "../lib/format";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { id } = useParams();
  const { user: me } = useAuth();
  const { data, loading, error, reload } = useApi(`/users/${id}`);
  const [tab, setTab] = useState("listings");
  useTitle(data?.user?.name);

  if (loading && !data) return <Spinner />;
  if (error) return <main className="container narrow"><ErrorState message={error} onRetry={reload} /></main>;

  const { user, listings, reviews } = data;
  const forSale = listings.filter((l) => l.status !== "sold");
  const sold = listings.filter((l) => l.status === "sold");
  const isMe = me?._id === user._id;

  return (
    <main className="container page">
      <section className="profile-head panel">
        <Avatar user={user} size={88} />
        <div className="profile-info">
          <h1>
            {user.name} <Verified user={user} withText />
          </h1>
          <SellerRating rating={user.rating} />
          <div className="profile-facts muted">
            {user.hostel && <span>{user.hostel}</span>}
            {user.course && <span>{user.course}</span>}
            <span>Joined {memberSince(user.createdAt)}</span>
            <span className="online">{lastSeen(user.lastActiveAt)}</span>
          </div>
          {user.bio && <p className="profile-bio">{user.bio}</p>}
        </div>
        <div className="profile-stats">
          <div>
            <strong>{forSale.length}</strong>
            <span>for sale</span>
          </div>
          <div>
            <strong>{sold.length}</strong>
            <span>sold</span>
          </div>
          <div>
            <strong>{user.rating.count}</strong>
            <span>reviews</span>
          </div>
        </div>
        {isMe && (
          <Link to="/settings" className="btn btn-outline profile-edit">
            Edit profile
          </Link>
        )}
      </section>

      <div className="tabs">
        <button className={tab === "listings" ? "active" : ""} onClick={() => setTab("listings")}>
          For sale <span className="tab-count">{forSale.length}</span>
        </button>
        <button className={tab === "sold" ? "active" : ""} onClick={() => setTab("sold")}>
          Sold <span className="tab-count">{sold.length}</span>
        </button>
        <button className={tab === "reviews" ? "active" : ""} onClick={() => setTab("reviews")}>
          Reviews <span className="tab-count">{reviews.length}</span>
        </button>
      </div>

      {tab !== "reviews" ? (
        (tab === "listings" ? forSale : sold).length ? (
          <div className="grid">
            {(tab === "listings" ? forSale : sold).map((l) => (
              <ListingCard key={l._id} listing={l} showSeller={false} />
            ))}
          </div>
        ) : (
          <Empty icon={<StorefrontOutlined />} title={tab === "listings" ? "Nothing for sale right now" : "Nothing sold yet"} />
        )
      ) : reviews.length ? (
        <div className="reviews">
          {reviews.map((r) => (
            <article className="review panel" key={r._id}>
              <UserLink user={r.reviewer} className="review-head">
                <Avatar user={r.reviewer} size={36} />
                <div>
                  <strong>{r.reviewer?.name}</strong>
                  <span className="muted small">
                    {timeAgo(r.createdAt)}
                    {r.listing && <> · bought {r.listing.title}</>}
                  </span>
                </div>
              </UserLink>
              <Stars value={r.rating} />
              {r.comment && <p>{r.comment}</p>}
            </article>
          ))}
        </div>
      ) : (
        <Empty icon={<RateReviewOutlined />} title="No reviews yet">
          Reviews appear after someone buys from {isMe ? "you" : user.name.split(" ")[0]}.
        </Empty>
      )}
    </main>
  );
}
