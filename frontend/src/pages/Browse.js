import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TuneRounded from "@mui/icons-material/TuneRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import SearchOffRounded from "@mui/icons-material/SearchOffRounded";
import ListingCard, { CardGridSkeleton } from "../components/ListingCard";
import { Empty, ErrorState, Pagination } from "../components/ui";
import { CATEGORIES, CONDITIONS, SORTS, categoryLabel } from "../lib/constants";
import { useApi, useTitle } from "../lib/hooks";
import { rupees } from "../lib/format";

const PRICE_PRESETS = [
  ["", "500", "Under ₹500"],
  ["500", "2000", "₹500 – ₹2,000"],
  ["2000", "10000", "₹2,000 – ₹10,000"],
  ["10000", "", "Over ₹10,000"],
];

function Filters({ params, update, onClose }) {
  const [min, setMin] = useState(params.get("minPrice") || "");
  const [max, setMax] = useState(params.get("maxPrice") || "");
  useEffect(() => {
    setMin(params.get("minPrice") || "");
    setMax(params.get("maxPrice") || "");
  }, [params]);

  const conditions = (params.get("condition") || "").split(",").filter(Boolean);
  const toggleCondition = (c) => {
    const next = conditions.includes(c) ? conditions.filter((x) => x !== c) : [...conditions, c];
    update({ condition: next.join(",") });
  };

  return (
    <aside className="filters">
      <div className="filters-head">
        <h3>Filters</h3>
        {onClose && (
          <button className="icon-btn" onClick={onClose} aria-label="Close filters">
            <CloseRounded />
          </button>
        )}
      </div>

      <div className="filter-group">
        <h4>Category</h4>
        <label className="radio">
          <input type="radio" name="cat" checked={!params.get("category")} onChange={() => update({ category: "" })} />
          All categories
        </label>
        {CATEGORIES.map((c) => (
          <label className="radio" key={c.slug}>
            <input type="radio" name="cat" checked={params.get("category") === c.slug} onChange={() => update({ category: c.slug })} />
            {c.label}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4>Price</h4>
        <form
          className="price-range"
          onSubmit={(e) => {
            e.preventDefault();
            update({ minPrice: min, maxPrice: max, free: "" });
          }}
        >
          <input type="number" min="0" inputMode="numeric" placeholder="Min" value={min} onChange={(e) => setMin(e.target.value)} aria-label="Minimum price" />
          <span>–</span>
          <input type="number" min="0" inputMode="numeric" placeholder="Max" value={max} onChange={(e) => setMax(e.target.value)} aria-label="Maximum price" />
          <button className="btn btn-outline btn-sm">Go</button>
        </form>
        <div className="chips">
          {PRICE_PRESETS.map(([lo, hi, label]) => (
            <button
              key={label}
              className={`chip ${params.get("minPrice") === lo && params.get("maxPrice") === hi ? "active" : ""}`}
              onClick={() => update({ minPrice: lo, maxPrice: hi, free: "" })}
            >
              {label}
            </button>
          ))}
          <button className={`chip ${params.get("free") === "1" ? "active" : ""}`} onClick={() => update({ free: params.get("free") === "1" ? "" : "1", minPrice: "", maxPrice: "" })}>
            Free
          </button>
        </div>
      </div>

      <div className="filter-group">
        <h4>Condition</h4>
        {CONDITIONS.map((c) => (
          <label className="check" key={c.value}>
            <input type="checkbox" checked={conditions.includes(c.value)} onChange={() => toggleCondition(c.value)} />
            {c.value}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <label className="check">
          <input type="checkbox" checked={params.get("status") === "any"} onChange={(e) => update({ status: e.target.checked ? "any" : "" })} />
          Include sold items
        </label>
      </div>
    </aside>
  );
}

export default function Browse() {
  const [params, setParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!("page" in changes)) next.delete("page");
    setParams(next);
    setShowFilters(false);
  };

  const query = new URLSearchParams(params);
  if (!query.get("sort")) query.set("sort", "newest");
  const { data, loading, error, reload } = useApi(`/listings?${query.toString()}`);

  const q = params.get("q");
  const category = params.get("category");
  const title = q ? `Results for “${q}”` : category ? categoryLabel(category) : params.get("free") ? "Free stuff" : "All items";
  useTitle(title);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params]);

  const active = [];
  if (q) active.push(["q", `“${q}”`]);
  if (category) active.push(["category", categoryLabel(category)]);
  if (params.get("minPrice") || params.get("maxPrice"))
    active.push(["price", `${params.get("minPrice") ? rupees(Number(params.get("minPrice"))) : "₹0"} – ${params.get("maxPrice") ? rupees(Number(params.get("maxPrice"))) : "any"}`]);
  if (params.get("free")) active.push(["free", "Free"]);
  if (params.get("condition")) active.push(["condition", params.get("condition").split(",").join(", ")]);
  if (params.get("status")) active.push(["status", "Including sold"]);

  const clear = (key) => (key === "price" ? update({ minPrice: "", maxPrice: "" }) : update({ [key]: "" }));

  return (
    <main className="container browse">
      <div className="browse-layout">
        <div className="filters-desktop">
          <Filters params={params} update={update} />
        </div>
        {showFilters && (
          <div className="filters-sheet" onMouseDown={(e) => e.target === e.currentTarget && setShowFilters(false)}>
            <Filters params={params} update={update} onClose={() => setShowFilters(false)} />
          </div>
        )}

        <section>
          <div className="browse-head">
            <div>
              <h1>{title}</h1>
              <p className="muted">{loading ? "Searching…" : data ? `${data.total.toLocaleString("en-IN")} listing${data.total === 1 ? "" : "s"}` : ""}</p>
            </div>
            <div className="browse-tools">
              <button className="btn btn-outline btn-sm show-sm" onClick={() => setShowFilters(true)}>
                <TuneRounded fontSize="small" /> Filters
              </button>
              <select value={params.get("sort") || "newest"} onChange={(e) => update({ sort: e.target.value === "newest" ? "" : e.target.value })} aria-label="Sort by">
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {active.length > 0 && (
            <div className="active-filters">
              {active.map(([key, label]) => (
                <button key={key} className="chip active" onClick={() => clear(key)}>
                  {label} <CloseRounded fontSize="inherit" />
                </button>
              ))}
              <button className="link-btn" onClick={() => setParams(new URLSearchParams())}>
                Clear all
              </button>
            </div>
          )}

          {loading ? (
            <CardGridSkeleton count={12} />
          ) : error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : data.listings.length === 0 ? (
            <Empty icon={<SearchOffRounded />} title="Nothing matches yet">
              Try a different search or remove a filter. New things get listed every day.
            </Empty>
          ) : (
            <>
              <div className="grid grid-browse">
                {data.listings.map((l) => (
                  <ListingCard key={l._id} listing={l} />
                ))}
              </div>
              <Pagination page={data.page} pages={data.pages} onChange={(p) => update({ page: String(p) })} />
            </>
          )}
        </section>
      </div>
    </main>
  );
}
