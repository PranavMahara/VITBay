// Built-in sample catalog used when no database is configured (portfolio demo mode).
// Images are generated SVGs so the demo has no external dependencies.

const palette = {
    Laptop: ["#1e3c72", "#2a5298"],
    Footwear: ["#f12711", "#f5af19"],
    Bottom: ["#134e5e", "#71b280"],
    Tops: ["#8e2de2", "#4a00e0"],
    Attire: ["#cb2d3e", "#ef473a"],
    Camera: ["#232526", "#606c76"],
    SmartPhones: ["#0f2027", "#2c7a9b"],
}

const image = (name, category) => {
    const [a, b] = palette[category]
    const label = name.replace(/&/g, "&amp;").replace(/</g, "&lt;")
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">` +
        `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>` +
        `<rect width="600" height="600" fill="url(#g)"/>` +
        `<text x="300" y="285" font-family="Helvetica,Arial,sans-serif" font-size="34" font-weight="700" fill="#fff" text-anchor="middle">${label}</text>` +
        `<text x="300" y="335" font-family="Helvetica,Arial,sans-serif" font-size="22" fill="#fff" fill-opacity=".75" text-anchor="middle">${category}</text></svg>`
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const items = [
    ["Aero Book 14", "Laptop", 54999, 4.5, 12, "Lightweight 14-inch laptop with a 12th-gen processor, 16 GB RAM and a 512 GB SSD."],
    ["Titan Gaming Pro", "Laptop", 89999, 4, 8, "High-refresh gaming laptop with a dedicated GPU and per-key RGB keyboard."],
    ["StrideRun Sneakers", "Footwear", 2499, 4, 40, "Breathable mesh running shoes with a cushioned sole for everyday comfort."],
    ["Urban Leather Boots", "Footwear", 3999, 3.5, 15, "Hand-finished leather boots built for the city and the occasional rainy day."],
    ["Classic Slim Jeans", "Bottom", 1799, 4.5, 60, "Slim-fit stretch denim in a timeless dark wash."],
    ["Everyday Chinos", "Bottom", 1499, 4, 45, "Soft cotton chinos that dress up or down."],
    ["Graphic Tee", "Tops", 699, 3.5, 100, "100% cotton crew-neck tee with a bold screen print."],
    ["Oxford Button-Down", "Tops", 1299, 4.5, 50, "Crisp oxford shirt for college, interviews and weekends."],
    ["Campus Hoodie", "Attire", 1999, 5, 30, "Heavyweight fleece hoodie in the VITBay colours."],
    ["Rain Shell Jacket", "Attire", 3499, 4, 20, "Packable waterproof jacket with taped seams."],
    ["Lumix Mirrorless M5", "Camera", 62999, 4.5, 6, "24 MP mirrorless camera with 4K video and in-body stabilisation."],
    ["ActionCam Mini", "Camera", 17999, 4, 14, "Pocket-size waterproof action camera with 5K recording."],
    ["Nova X Smartphone", "SmartPhones", 24999, 4, 25, "6.6-inch AMOLED display, 5000 mAh battery and a 64 MP camera."],
    ["Pixelite 8", "SmartPhones", 45999, 4.5, 18, "Flagship phone with a flagship-grade chipset and an all-day battery."],
]

const owner = "000000000000000000000000"

const products = items.map(([name, category, price, rating, Stock, description], i) => ({
    _id: `demo${String(i + 1).padStart(2, "0")}`.padEnd(24, "0"),
    name,
    description,
    price,
    rating,
    images: [{ public_id: `demo/${i + 1}`, url: image(name, category) }],
    category,
    Stock,
    numOfReviews: 0,
    reviews: [],
    user: owner,
    createdAt: new Date(Date.UTC(2023, 0, 1 + i)).toISOString(),
}))

module.exports = products
