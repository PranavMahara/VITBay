import React from "react";
import { Link } from "react-router-dom";
import { useTitle } from "../lib/hooks";

export function About() {
  useTitle("About");
  return (
    <main className="container narrow page prose">
      <h1>About VITBay</h1>
      <p className="lead">
        Every semester, thousands of perfectly good calculators, drafters, mattresses and cycles change hands on campus, usually through
        hostel WhatsApp groups where listings scroll away in minutes. VITBay gives them a proper home.
      </p>
      <h2>What it is</h2>
      <p>
        A marketplace just for students. You list what you don't need, someone a few blocks away messages you, you agree on a price and meet
        somewhere on campus. There are no fees, no delivery and no payments through the site: you pay in person, by UPI or cash, once you've
        seen the item.
      </p>
      <h2>Why it works better than a group chat</h2>
      <ul>
        <li>Search and filters, so you can find a used Casio fx-991 under ₹600 in seconds.</li>
        <li>Profiles, reviews and the VIT verified badge, so you know who you're dealing with.</li>
        <li>Private messaging and offers, so your phone number stays yours.</li>
        <li>Listings stay up until they're sold, then get marked as sold.</li>
      </ul>
      <h2>Who's behind it</h2>
      <p>
        VITBay is an independent project built and run by students, Pranav Singh Mahara among them. It isn't affiliated with or endorsed by
        VIT. Found a bug, or have an idea? Open an issue on <a href="https://github.com/PranavMahara/VITBay" target="_blank" rel="noreferrer">GitHub</a>.
      </p>
      <p>
        Some photos on sample listings are from Wikimedia Commons, Flickr and Unsplash, used under their Creative Commons or Unsplash licences.{" "}
        <Link to="/credits">See photo credits</Link>.
      </p>
    </main>
  );
}

export function Safety() {
  useTitle("Safety tips");
  return (
    <main className="container narrow page prose">
      <h1>Buying and selling safely</h1>
      <p className="lead">Almost every deal on VITBay goes smoothly. These habits keep it that way.</p>
      <h2>Meet on campus, in public</h2>
      <p>
        Pick busy spots like the SJT lobby, the library entrance or Foodys, during the day. For hostel items, meet at the hostel gate rather than
        inside rooms.
      </p>
      <h2>Inspect before you pay</h2>
      <p>
        Switch on electronics, check the battery health on phones and laptops, test the brakes on cycles and flip through books for missing
        pages. Pay only once you're happy.
      </p>
      <h2>Never pay in advance</h2>
      <p>
        No advance UPI transfers or "token amounts" to hold an item. Ask the seller to mark it as reserved for you instead. Never share an OTP
        or scan a QR code to "receive" money.
      </p>
      <h2>Keep the conversation on VITBay</h2>
      <p>Messages here are tied to the listing and to a real student account, which helps if something goes wrong.</p>
      <h2>Report anything off</h2>
      <p>
        Use <strong>Report listing</strong> on any item that looks like a scam, is prohibited or is in the wrong place. Reports are reviewed by
        the team.
      </p>
    </main>
  );
}

export function Guidelines() {
  useTitle("Community guidelines");
  return (
    <main className="container narrow page prose">
      <h1>Community guidelines</h1>
      <h2>What you can list</h2>
      <p>Things students actually use: books and notes you wrote yourself, electronics, room and hostel stuff, cycles, sports gear, instruments, clothes.</p>
      <h2>What you can't</h2>
      <ul>
        <li>Anything banned in hostels or by campus rules, including alcohol, tobacco, vapes and weapons.</li>
        <li>Medicines, exam papers, assignments for submission, or fake IDs.</li>
        <li>Pirated software, copied course material or counterfeit goods.</li>
        <li>Services, rentals and job postings (this is for second-hand items).</li>
      </ul>
      <h2>Be honest</h2>
      <p>Use your own photos, describe flaws and mark items as sold when they're gone. Don't relist the same item over and over.</p>
      <h2>Be decent</h2>
      <p>No harassment, spam or lowballing to the point of rudeness. Accounts that break these rules are removed.</p>
    </main>
  );
}

export function NotFound() {
  useTitle("Page not found");
  return (
    <main className="container narrow page center not-found">
      <div className="nf-code">404</div>
      <h1>We couldn't find that page</h1>
      <p className="muted">It may have been sold, deleted, or the link is wrong.</p>
      <Link to="/browse" className="btn btn-primary">
        Browse items
      </Link>
    </main>
  );
}
