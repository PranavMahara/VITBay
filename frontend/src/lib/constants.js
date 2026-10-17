// Keep in sync with backend/utils/constants.js
import LaptopMacOutlined from "@mui/icons-material/LaptopMacOutlined";
import PhoneIphoneOutlined from "@mui/icons-material/PhoneIphoneOutlined";
import HeadphonesOutlined from "@mui/icons-material/HeadphonesOutlined";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import ScienceOutlined from "@mui/icons-material/ScienceOutlined";
import BedOutlined from "@mui/icons-material/BedOutlined";
import PedalBikeOutlined from "@mui/icons-material/PedalBikeOutlined";
import SportsTennisOutlined from "@mui/icons-material/SportsTennisOutlined";
import MusicNoteOutlined from "@mui/icons-material/MusicNoteOutlined";
import CheckroomOutlined from "@mui/icons-material/CheckroomOutlined";
import CategoryOutlined from "@mui/icons-material/CategoryOutlined";

export const CATEGORIES = [
  { slug: "laptops", label: "Laptops & PCs", short: "Laptops", Icon: LaptopMacOutlined },
  { slug: "phones", label: "Phones & Tablets", short: "Phones", Icon: PhoneIphoneOutlined },
  { slug: "electronics", label: "Electronics & Gadgets", short: "Electronics", Icon: HeadphonesOutlined },
  { slug: "books", label: "Books & Notes", short: "Books", Icon: MenuBookOutlined },
  { slug: "stationery", label: "Lab & Stationery", short: "Lab & stationery", Icon: ScienceOutlined },
  { slug: "room", label: "Room & Hostel", short: "Room & hostel", Icon: BedOutlined },
  { slug: "cycles", label: "Cycles & Rides", short: "Cycles", Icon: PedalBikeOutlined },
  { slug: "sports", label: "Sports & Fitness", short: "Sports", Icon: SportsTennisOutlined },
  { slug: "music", label: "Music & Hobbies", short: "Music & hobbies", Icon: MusicNoteOutlined },
  { slug: "fashion", label: "Clothing & Shoes", short: "Clothing", Icon: CheckroomOutlined },
  { slug: "other", label: "Other", short: "Other", Icon: CategoryOutlined },
];

export const categoryLabel = (slug) => CATEGORIES.find((c) => c.slug === slug)?.label || "Other";

export const CONDITIONS = [
  { value: "Brand new", hint: "Unused, still sealed or with tags" },
  { value: "Like new", hint: "Used a few times, no visible wear" },
  { value: "Good", hint: "Normal use, minor marks" },
  { value: "Fair", hint: "Works, but clearly used" },
  { value: "For parts", hint: "Doesn't fully work" },
];

export const HOSTELS = [
  ...["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R"].map((b) => `MH ${b} Block`),
  ...["A", "B", "C", "D", "E", "F", "G", "H"].map((b) => `LH ${b} Block`),
  "Day scholar",
];

export const MEETUP_SPOTS = [
  "SJT lobby",
  "TT entrance",
  "Main Building",
  "Central Library",
  "Foodys",
  "Anna Auditorium",
  "SMV ground floor",
  "MGB steps",
  "GDN parking",
  "Main Gate",
];

export const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "popular", label: "Most saved" },
];

export const REPORT_REASONS = ["Prohibited item", "Scam or fraud", "Wrong category", "Offensive content", "Already sold", "Other"];
