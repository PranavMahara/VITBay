import React, { useRef, useState } from "react";
import { Avatar } from "../components/ui";
import { HOSTELS } from "../lib/constants";
import { useTitle } from "../lib/hooks";
import api, { errorMessage } from "../lib/api";
import { uploadPhoto } from "../lib/image";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function ProfileForm() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const fileInput = useRef(null);
  const [form, setForm] = useState({ name: user.name, hostel: user.hostel || "", course: user.course || "", bio: user.bio || "" });
  const [avatar, setAvatar] = useState(user.avatar);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const pickAvatar = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      setAvatar(await uploadPhoto(file, "avatar"));
    } catch (err) {
      toast.error(errorMessage(err, err.message));
    }
    setUploading(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.put("/auth/me", { ...form, avatar: avatar?.url || "" });
      setUser(data.user);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(errorMessage(err));
    }
    setBusy(false);
  };

  return (
    <form className="panel stack" onSubmit={submit}>
      <h2>Profile</h2>
      <div className="avatar-edit">
        <Avatar user={{ ...user, name: form.name, avatar }} size={72} />
        <div className="stack-sm">
          <button type="button" className="btn btn-outline btn-sm" onClick={() => fileInput.current.click()} disabled={uploading}>
            {uploading ? "Uploading…" : "Change photo"}
          </button>
          {avatar?.url && (
            <button type="button" className="link-btn small" onClick={() => setAvatar(null)}>
              Remove photo
            </button>
          )}
        </div>
        <input ref={fileInput} type="file" accept="image/*" hidden onChange={pickAvatar} />
      </div>
      <label className="field">
        <span>Name</span>
        <input value={form.name} onChange={set("name")} required maxLength={40} />
      </label>
      <div className="row-2">
        <label className="field">
          <span>Hostel</span>
          <select value={form.hostel} onChange={set("hostel")}>
            <option value="">Prefer not to say</option>
            {HOSTELS.map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Course and year</span>
          <input value={form.course} onChange={set("course")} maxLength={60} placeholder="e.g. B.Tech CSE, 2nd year" />
        </label>
      </div>
      <label className="field">
        <span>About you</span>
        <textarea rows={3} value={form.bio} onChange={set("bio")} maxLength={280} placeholder="A line or two buyers will see on your profile" />
      </label>
      <button className="btn btn-primary" disabled={busy}>
        {busy ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}

function PasswordForm() {
  const toast = useToast();
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) return toast.error("New passwords don't match");
    setBusy(true);
    try {
      await api.put("/auth/password", form);
      toast.success("Password changed");
      setForm({ oldPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      toast.error(errorMessage(err));
    }
    setBusy(false);
  };

  return (
    <form className="panel stack" onSubmit={submit}>
      <h2>Password</h2>
      <label className="field">
        <span>Current password</span>
        <input type="password" autoComplete="current-password" value={form.oldPassword} onChange={set("oldPassword")} required />
      </label>
      <div className="row-2">
        <label className="field">
          <span>New password</span>
          <input type="password" autoComplete="new-password" minLength={8} value={form.newPassword} onChange={set("newPassword")} required />
        </label>
        <label className="field">
          <span>Confirm new password</span>
          <input type="password" autoComplete="new-password" minLength={8} value={form.confirm} onChange={set("confirm")} required />
        </label>
      </div>
      <button className="btn btn-outline" disabled={busy}>
        {busy ? "Saving…" : "Change password"}
      </button>
    </form>
  );
}

export default function Settings() {
  useTitle("Settings");
  const { user } = useAuth();
  return (
    <main className="container narrow page">
      <h1>Settings</h1>
      <p className="muted lead">Signed in as {user.email}</p>
      <ProfileForm />
      <PasswordForm />
    </main>
  );
}
