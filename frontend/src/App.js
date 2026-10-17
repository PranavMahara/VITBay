import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { RequireAuth, Spinner } from "./components/ui";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import ListingPage from "./pages/ListingPage";
import { Login, Register, ForgotPassword, ResetPassword } from "./pages/Auth";
import { About, Guidelines, NotFound, Safety } from "./pages/Info";

const ListingForm = lazy(() => import("./pages/ListingForm"));
const Inbox = lazy(() => import("./pages/Inbox"));
const Profile = lazy(() => import("./pages/Profile"));
const MyListings = lazy(() => import("./pages/MyListings"));
const Saved = lazy(() => import("./pages/Saved"));
const Settings = lazy(() => import("./pages/Settings"));
const Credits = lazy(() => import("./pages/Credits"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Shell() {
  const { pathname } = useLocation();
  const bare = ["/login", "/register", "/password"].some((p) => pathname.startsWith(p));
  const fullHeight = pathname.startsWith("/inbox");

  return (
    <div className={`app ${fullHeight ? "app-fixed" : ""}`}>
      {!bare && <Navbar />}
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/listing/:id" element={<ListingPage />} />
          <Route path="/listing/:id/edit" element={<RequireAuth><ListingForm /></RequireAuth>} />
          <Route path="/sell" element={<RequireAuth><ListingForm /></RequireAuth>} />
          <Route path="/u/:id" element={<Profile />} />
          <Route path="/inbox" element={<RequireAuth><Inbox /></RequireAuth>} />
          <Route path="/inbox/:id" element={<RequireAuth><Inbox /></RequireAuth>} />
          <Route path="/my/listings" element={<RequireAuth><MyListings /></RequireAuth>} />
          <Route path="/saved" element={<RequireAuth><Saved /></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/guidelines" element={<Guidelines />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {!bare && !fullHeight && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Shell />
    </BrowserRouter>
  );
}
