import React from "react";
import { Link } from "react-router-dom";
import FavoriteBorderRounded from "@mui/icons-material/FavoriteBorderRounded";
import ListingCard, { CardGridSkeleton } from "../components/ListingCard";
import { Empty, ErrorState } from "../components/ui";
import { useApi, useTitle } from "../lib/hooks";
import { useAuth } from "../context/AuthContext";

export default function Saved() {
  useTitle("Saved items");
  const { data, loading, error, reload } = useApi("/me/saved");
  const { isSaved } = useAuth();
  // Hide items the user un-saves while on this page
  const listings = data?.listings?.filter((l) => isSaved(l._id)) || [];

  return (
    <main className="container page">
      <div className="page-head">
        <h1>Saved items</h1>
      </div>
      {loading ? (
        <CardGridSkeleton count={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : listings.length === 0 ? (
        <Empty icon={<FavoriteBorderRounded />} title="Nothing saved yet" action={<Link to="/browse" className="btn btn-primary">Browse items</Link>}>
          Tap the heart on any listing to keep an eye on it.
        </Empty>
      ) : (
        <div className="grid">
          {listings.map((l) => (
            <ListingCard key={l._id} listing={l} />
          ))}
        </div>
      )}
    </main>
  );
}
