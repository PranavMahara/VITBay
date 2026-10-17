import React, { useState } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Logo } from "../components/Navbar";
import { HOSTELS } from "../lib/constants";
import { useTitle } from "../lib/hooks";
import api, { errorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

// Only allow redirects back into the app
const safeNext = (next) => (next && next.startsWith("/") && !next.startsWith("//") ? next : "/");

function AuthShell({ title, subtitle, children, footer }) {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <Logo />
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
        {children}
        {footer && <div className="auth-footer">{footer}</div>}
      </div>
    </main>
  );
}

export function Login() {
  useTitle("Log in");
  const { user, login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (user) return <Navigate to={next} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const u = await login(form.email, form.password);
      toast.success(`Welcome back, ${u.name.split(" ")[0]}`);
      navigate(next, { replace: true });
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to message sellers and manage your listings."
      footer={
        <>
          New to VITBay? <Link to={`/register${params.get("next") ? `?next=${encodeURIComponent(next)}` : ""}`}>Create an account</Link>
        </>
      }
    >
      <form className="stack" onSubmit={submit}>
        {error && <div className="form-error">{error}</div>}
        <label className="field">
          <span>Email</span>
          <input type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoFocus />
        </label>
        <label className="field">
          <span className="field-row">
            Password <Link to="/password/forgot" className="small">Forgot?</Link>
          </span>
          <input type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </label>
        <button className="btn btn-primary btn-block btn-lg" disabled={busy}>
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
}

export function Register() {
  useTitle("Create account");
  const { user, register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));
  const [form, setForm] = useState({ name: "", email: "", password: "", hostel: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (user) return <Navigate to={next} replace />;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const collegeEmail = /@(vitstudent\.ac\.in|vit\.ac\.in)$/i.test(form.email.trim());

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const u = await register(form);
      toast.success(`Welcome to VITBay, ${u.name.split(" ")[0]}!`);
      navigate(next === "/" ? "/sell" : next, { replace: true });
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Free, takes 30 seconds, and lets you buy and sell on campus."
      footer={
        <>
          Already have an account? <Link to={`/login${params.get("next") ? `?next=${encodeURIComponent(next)}` : ""}`}>Log in</Link>
        </>
      }
    >
      <form className="stack" onSubmit={submit}>
        {error && <div className="form-error">{error}</div>}
        <label className="field">
          <span>Full name</span>
          <input autoComplete="name" value={form.name} onChange={set("name")} required minLength={2} maxLength={40} autoFocus />
        </label>
        <label className="field">
          <span>Email</span>
          <input type="email" autoComplete="email" value={form.email} onChange={set("email")} required placeholder="you@vitstudent.ac.in" />
          <small className={collegeEmail ? "ok" : "muted"}>
            {collegeEmail ? "College email: you'll get the VIT verified badge." : "Use your college email to get a verified badge buyers trust."}
          </small>
        </label>
        <label className="field">
          <span>Password</span>
          <input type="password" autoComplete="new-password" value={form.password} onChange={set("password")} required minLength={8} />
          <small className="muted">At least 8 characters.</small>
        </label>
        <label className="field">
          <span>Hostel</span>
          <select value={form.hostel} onChange={set("hostel")}>
            <option value="">Choose (optional)</option>
            {HOSTELS.map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
        </label>
        <button className="btn btn-primary btn-block btn-lg" disabled={busy}>
          {busy ? "Creating account…" : "Create account"}
        </button>
        <p className="muted small center">
          By joining you agree to our <Link to="/guidelines">community guidelines</Link>.
        </p>
      </form>
    </AuthShell>
  );
}

export function ForgotPassword() {
  useTitle("Reset password");
  const [email, setEmail] = useState("");
  const [state, setState] = useState({ busy: false, message: "", error: "" });

  const submit = async (e) => {
    e.preventDefault();
    setState({ busy: true, message: "", error: "" });
    try {
      const { data } = await api.post("/auth/password/forgot", { email });
      setState({ busy: false, message: data.message, error: "" });
    } catch (err) {
      setState({ busy: false, message: "", error: errorMessage(err) });
    }
  };

  return (
    <AuthShell title="Forgot your password?" subtitle="Enter your email and we'll send you a link to choose a new one." footer={<Link to="/login">Back to log in</Link>}>
      {state.message ? (
        <div className="form-success">{state.message}</div>
      ) : (
        <form className="stack" onSubmit={submit}>
          {state.error && <div className="form-error">{state.error}</div>}
          <label className="field">
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </label>
          <button className="btn btn-primary btn-block" disabled={state.busy}>
            {state.busy ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}

export function ResetPassword() {
  useTitle("Choose a new password");
  const { token } = useParams();
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await api.put(`/auth/password/reset/${token}`, form);
      setUser(data.user);
      toast.success("Password updated. You're logged in.");
      navigate("/", { replace: true });
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Choose a new password">
      <form className="stack" onSubmit={submit}>
        {error && <div className="form-error">{error}</div>}
        <label className="field">
          <span>New password</span>
          <input type="password" autoComplete="new-password" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </label>
        <label className="field">
          <span>Confirm password</span>
          <input type="password" autoComplete="new-password" minLength={8} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
        </label>
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "Saving…" : "Save password"}
        </button>
      </form>
    </AuthShell>
  );
}
