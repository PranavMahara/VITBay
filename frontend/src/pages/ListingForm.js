import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddAPhotoOutlined from "@mui/icons-material/AddAPhotoOutlined";
import CloseRounded from "@mui/icons-material/CloseRounded";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import { ErrorState, Spinner } from "../components/ui";
import { CATEGORIES, CONDITIONS, MEETUP_SPOTS } from "../lib/constants";
import { useTitle } from "../lib/hooks";
import api, { errorMessage } from "../lib/api";
import { uploadPhoto } from "../lib/image";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const MAX_PHOTOS = 8;
const EMPTY = { title: "", category: "", condition: "", price: "", originalPrice: "", negotiable: true, description: "", meetupSpot: "" };

function PhotoPicker({ photos, setPhotos }) {
  const toast = useToast();
  const input = useRef(null);
  const [uploading, setUploading] = useState(0);

  const add = async (files) => {
    const list = Array.from(files).slice(0, MAX_PHOTOS - photos.length);
    if (!list.length) return;
    setUploading((n) => n + list.length);
    for (const file of list) {
      try {
        const img = await uploadPhoto(file);
        setPhotos((p) => [...p, img].slice(0, MAX_PHOTOS));
      } catch (err) {
        toast.error(errorMessage(err, err.message));
      }
      setUploading((n) => n - 1);
    }
  };

  const move = (i, d) =>
    setPhotos((p) => {
      const next = [...p];
      const j = i + d;
      if (j < 0 || j >= next.length) return p;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <div>
      <div
        className="photo-grid"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          add(e.dataTransfer.files);
        }}
      >
        {photos.map((p, i) => (
          <div className="photo-slot" key={p.url}>
            <img src={p.url} alt={`Upload ${i + 1}`} />
            {i === 0 && <span className="cover-tag">Cover</span>}
            <div className="photo-tools">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move left">
                <ArrowBackRounded fontSize="inherit" />
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === photos.length - 1} aria-label="Move right">
                <ArrowForwardRounded fontSize="inherit" />
              </button>
              <button type="button" onClick={() => setPhotos((ps) => ps.filter((_, n) => n !== i))} aria-label="Remove photo">
                <CloseRounded fontSize="inherit" />
              </button>
            </div>
          </div>
        ))}
        {Array.from({ length: uploading }, (_, i) => (
          <div className="photo-slot uploading" key={`u${i}`}>
            <span className="spinner" />
          </div>
        ))}
        {photos.length + uploading < MAX_PHOTOS && (
          <button type="button" className="photo-add" onClick={() => input.current.click()}>
            <AddAPhotoOutlined />
            <span>{photos.length ? "Add more" : "Add photos"}</span>
            <small className="muted">or drag them here</small>
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => { add(e.target.files); e.target.value = ""; }} />
      <p className="hint">Up to {MAX_PHOTOS} photos. Use daylight and show any scratches or damage: honest photos sell faster.</p>
    </div>
  );
}

export default function ListingForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  useTitle(editing ? "Edit listing" : "Sell an item");
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [form, setForm] = useState({ ...EMPTY, meetupSpot: user?.hostel || "" });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(editing);
  const [loadError, setLoadError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) return;
    api
      .get(`/listings/${id}`)
      .then(({ data }) => {
        if (!data.viewer.isOwner) throw new Error("You can only edit your own listings");
        const l = data.listing;
        setForm({
          title: l.title,
          category: l.category,
          condition: l.condition,
          price: String(l.price),
          originalPrice: l.originalPrice ? String(l.originalPrice) : "",
          negotiable: l.negotiable,
          description: l.description,
          meetupSpot: l.meetupSpot || "",
        });
        setPhotos(l.images);
      })
      .catch((err) => setLoadError(errorMessage(err, err.message)))
      .finally(() => setLoading(false));
  }, [editing, id]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!photos.length) return toast.error("Add at least one photo");
    if (!form.category) return toast.error("Pick a category");
    if (!form.condition) return toast.error("Pick a condition");
    setSaving(true);
    const body = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      images: photos.map((p) => p.url),
    };
    try {
      const { data } = editing ? await api.patch(`/listings/${id}`, body) : await api.post("/listings", body);
      toast.success(editing ? "Changes saved" : "Your listing is live!");
      navigate(`/listing/${data.listing._id}`);
    } catch (err) {
      toast.error(errorMessage(err));
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;
  if (loadError) return <main className="container narrow"><ErrorState message={loadError} /></main>;

  const free = form.price === "0";

  return (
    <main className="container narrow page">
      <h1>{editing ? "Edit listing" : "Sell an item"}</h1>
      <p className="muted lead">{editing ? "Update the details below." : "Takes about a minute. Buyers will message you on VITBay, so your number stays private."}</p>

      <form className="sell-form" onSubmit={submit}>
        <section className="panel">
          <h2>Photos</h2>
          <PhotoPicker photos={photos} setPhotos={setPhotos} />
        </section>

        <section className="panel">
          <h2>Details</h2>
          <label className="field">
            <span>Title</span>
            <input value={form.title} onChange={set("title")} maxLength={80} required placeholder="e.g. Casio fx-991ES Plus, barely used" />
            <small className="muted">Include the brand, model and size if it has one.</small>
          </label>

          <div className="field">
            <span>Category</span>
            <div className="choice-grid">
              {CATEGORIES.map(({ slug, label, Icon }) => (
                <button type="button" key={slug} className={`choice ${form.category === slug ? "active" : ""}`} onClick={() => setForm((f) => ({ ...f, category: slug }))}>
                  <Icon fontSize="small" /> {label}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <span>Condition</span>
            <div className="choice-grid conditions">
              {CONDITIONS.map((c) => (
                <button type="button" key={c.value} className={`choice choice-col ${form.condition === c.value ? "active" : ""}`} onClick={() => setForm((f) => ({ ...f, condition: c.value }))}>
                  <strong>{c.value}</strong>
                  <small>{c.hint}</small>
                </button>
              ))}
            </div>
          </div>

          <label className="field">
            <span>Description</span>
            <textarea
              rows={6}
              value={form.description}
              onChange={set("description")}
              maxLength={2000}
              required
              placeholder="How old is it? Why are you selling? Anything included (charger, box, cover)? Any flaws?"
            />
            <small className="muted right">{form.description.length}/2000</small>
          </label>
        </section>

        <section className="panel">
          <h2>Price</h2>
          <div className="row-2">
            <label className="field">
              <span>Your price</span>
              <div className="input-prefix">
                <span>₹</span>
                <input type="number" min="0" max="500000" inputMode="numeric" value={form.price} onChange={set("price")} required placeholder="0 to give it away" />
              </div>
            </label>
            <label className="field">
              <span>
                Price when new <em className="muted">(optional)</em>
              </span>
              <div className="input-prefix">
                <span>₹</span>
                <input type="number" min="0" inputMode="numeric" value={form.originalPrice} onChange={set("originalPrice")} placeholder="Helps buyers see the deal" />
              </div>
            </label>
          </div>
          {!free && (
            <label className="check">
              <input type="checkbox" checked={form.negotiable} onChange={set("negotiable")} /> Open to offers
            </label>
          )}
        </section>

        <section className="panel">
          <h2>Meet-up</h2>
          <label className="field">
            <span>Where can buyers meet you?</span>
            <input list="spots" value={form.meetupSpot} onChange={set("meetupSpot")} maxLength={60} placeholder="e.g. SJT lobby or MH A Block gate" />
            <datalist id="spots">
              {MEETUP_SPOTS.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </label>
          <div className="chips">
            {MEETUP_SPOTS.slice(0, 6).map((s) => (
              <button type="button" key={s} className={`chip ${form.meetupSpot === s ? "active" : ""}`} onClick={() => setForm((f) => ({ ...f, meetupSpot: s }))}>
                {s}
              </button>
            ))}
          </div>
        </section>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button className="btn btn-primary btn-lg" disabled={saving}>
            {saving ? "Saving…" : editing ? "Save changes" : "Post listing"}
          </button>
        </div>
      </form>
    </main>
  );
}
