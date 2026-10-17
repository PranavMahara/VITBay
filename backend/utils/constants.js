// Shared listing vocabulary (the frontend keeps a copy in src/lib/constants.js)

const CATEGORIES = {
    laptops: "Laptops & PCs",
    phones: "Phones & Tablets",
    electronics: "Electronics & Gadgets",
    books: "Books & Notes",
    stationery: "Lab & Stationery",
    room: "Room & Hostel",
    cycles: "Cycles & Rides",
    sports: "Sports & Fitness",
    music: "Music & Hobbies",
    fashion: "Clothing & Shoes",
    other: "Other",
}

const CONDITIONS = ["Brand new", "Like new", "Good", "Fair", "For parts"]

const STATUSES = ["active", "reserved", "sold"]

const REPORT_REASONS = ["Prohibited item", "Scam or fraud", "Wrong category", "Offensive content", "Already sold", "Other"]

module.exports = { CATEGORIES, CONDITIONS, STATUSES, REPORT_REASONS }
