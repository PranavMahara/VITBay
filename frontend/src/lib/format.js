export const rupees = (n) => (n === 0 ? "Free" : `₹${Number(n).toLocaleString("en-IN")}`);

export const discount = (price, original) =>
  original && original > price && price > 0 ? Math.round(((original - price) / original) * 100) : 0;

export const timeAgo = (date) => {
  const s = Math.max(0, (Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return "just now";
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [name, secs] of units) {
    const n = Math.floor(s / secs);
    if (n >= 1) return `${n} ${name}${n > 1 ? "s" : ""} ago`;
  }
  return "just now";
};

export const lastSeen = (date) => {
  if (!date) return "";
  const mins = (Date.now() - new Date(date).getTime()) / 60000;
  if (mins < 10) return "Active now";
  return `Active ${timeAgo(date)}`;
};

export const memberSince = (date) =>
  new Date(date).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

export const clockTime = (date) =>
  new Date(date).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });

export const dayLabel = (date) => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(Date.now() - 864e5);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: d.getFullYear() === today.getFullYear() ? undefined : "numeric" });
};

export const shortDate = (date) => {
  const d = new Date(date);
  if (d.toDateString() === new Date().toDateString()) return clockTime(d);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

export const firstName = (name = "") => name.split(" ")[0];
