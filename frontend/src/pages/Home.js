import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchRounded from "@mui/icons-material/SearchRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import PhotoCameraOutlined from "@mui/icons-material/PhotoCameraOutlined";
import ForumOutlined from "@mui/icons-material/ForumOutlined";
import HandshakeOutlined from "@mui/icons-material/HandshakeOutlined";
import ListingCard, { CardGridSkeleton } from "../components/ListingCard";
import { ErrorState } from "../components/ui";
import { CATEGORIES } from "../lib/constants";
import { useApi, useTitle } from "../lib/hooks";
import { useAuth } from "../context/AuthContext";

const QUICK = ["Casio calculator", "Cycle", "Mattress", "Drafter", "Lab coat", "Kettle"];

function Section({ title, link, path, limit = 8 }) {
  const { data, loading, error, reload } = useApi(path);
  if (!loading && !error && !data?.listings?.length) return null;
  return (
    <section className="section">
      <div className="section-head">
        <h2>{title}</h2>
        {link && (
          <Link to={link} className="see-all">
            See all <ArrowForwardRounded fontSize="small" />
          </Link>
        )}
      </div>
      {loading ? (
        <CardGridSkeleton count={limit} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <div className="grid">
          {data.listings.map((l) => (
            <ListingCard key={l._id} listing={l} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function Home() {
  useTitle("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const { data: stats } = useApi("/stats");

  return (
    <main>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">The campus marketplace for VIT students</p>
            <h1>
              Buy it from a senior.
              <br />
              Sell it to a junior.
            </h1>
            <p className="hero-sub">
              Textbooks, calculators, cycles, mattresses and everything else your hostel room needs, from students a few blocks away. No shipping,
              no middlemen.
            </p>
            <form
              className="hero-search"
              onSubmit={(e) => {
                e.preventDefault();
                navigate(q.trim() ? `/browse?q=${encodeURIComponent(q.trim())}` : "/browse");
              }}
            >
              <SearchRounded />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="What are you looking for?" aria-label="Search" />
              <button className="btn btn-primary">Search</button>
            </form>
            <div className="quick">
              {QUICK.map((t) => (
                <Link key={t} to={`/browse?q=${encodeURIComponent(t)}`}>
                  {t}
                </Link>
              ))}
            </div>
          </div>
          {stats && (
            <div className="hero-stats">
              <div>
                <strong>{stats.active.toLocaleString("en-IN")}</strong>
                <span>items for sale</span>
              </div>
              <div>
                <strong>{stats.sold.toLocaleString("en-IN")}</strong>
                <span>items rehomed</span>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="container">
        <section className="section">
          <div className="section-head">
            <h2>Shop by category</h2>
          </div>
          <div className="cat-grid">
            {CATEGORIES.filter((c) => c.slug !== "other").map(({ slug, label, Icon }) => (
              <Link key={slug} to={`/browse?category=${slug}`} className="cat-tile">
                <span className="cat-icon">
                  <Icon />
                </span>
                <span className="cat-name">{label}</span>
                <span className="muted cat-count">{stats ? `${stats.categories[slug] || 0} listings` : " "}</span>
              </Link>
            ))}
          </div>
        </section>

        <Section title="Fresh on campus" link="/browse" path="/listings?limit=10" limit={10} />
        <Section title="Under ₹500" link="/browse?maxPrice=500&sort=price_asc" path="/listings?maxPrice=500&limit=5&sort=newest" limit={5} />
        <Section title="For your desk" link="/browse?category=laptops" path="/listings?category=laptops&limit=5" limit={5} />

        <section className="section how">
          <div className="section-head">
            <h2>How VITBay works</h2>
          </div>
          <div className="how-grid">
            <div className="how-step">
              <PhotoCameraOutlined />
              <h3>List in a minute</h3>
              <p className="muted">Snap a few photos, set a price and pick a spot on campus where you can meet.</p>
            </div>
            <div className="how-step">
              <ForumOutlined />
              <h3>Chat and make offers</h3>
              <p className="muted">Message the seller, ask questions and send an offer. Your number and email stay private.</p>
            </div>
            <div className="how-step">
              <HandshakeOutlined />
              <h3>Meet and pay in person</h3>
              <p className="muted">Check the item, pay by UPI or cash, and leave a review so the next buyer knows who to trust.</p>
            </div>
          </div>
        </section>

        <section className="sell-band">
          <div>
            <h2>Leaving campus or clearing out your room?</h2>
            <p>Most things on VITBay sell within a week. Listing is free.</p>
          </div>
          <Link to={user ? "/sell" : "/register?next=/sell"} className="btn btn-light btn-lg">
            Start selling
          </Link>
        </section>
      </div>
    </main>
  );
}
