// Demo mode: when no database connection string is configured the API serves a
// read-only sample catalog instead of failing, so the public portfolio link keeps working.
const ErrorHandler = require("../utils/errorHandler")
const products = require("./products")

const isDemoMode = () => !process.env.connectionString

// Mirrors the search / filter / pagination behaviour of utils/apiFeatures.js
const queryProducts = (query = {}, resultPerPage = 12) => {
    const keyword = (query.keyword || "").toLowerCase()
    const gte = (v) => (v === undefined ? -Infinity : Number(v))
    const lte = (v) => (v === undefined ? Infinity : Number(v))

    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(keyword) &&
        (!query.category || p.category === query.category) &&
        (!query.condition || p.condition === query.condition) &&
        p.price >= gte(query.price?.gte) && p.price <= lte(query.price?.lte) &&
        p.rating >= gte(query.rating?.gte) && p.rating <= lte(query.rating?.lte)
    )

    const page = Number(query.page) || 1
    return {
        products: filtered.slice(resultPerPage * (page - 1), resultPerPage * page),
        productsCount: products.length,
        resultPerPage,
        filteredProductsCount: filtered.length,
    }
}

const findProduct = (id) => products.find((p) => p._id === id)

// Express middleware: only the catalog is available in demo mode
const demoGuard = (req, res, next) => {
    const p = req.path
    if (req.method === "GET" && (p === "/v1/products" || /^\/v1\/product\/[^/]+$/.test(p))) return next()
    if (req.method === "GET" && p === "/v1/logout") return res.status(200).json({ success: true, message: "Logged Out" })
    // The frontend probes these on every page load; behave like a logged-out visitor
    if (req.method === "GET" && (p === "/v1/me" || p === "/v1/stripeapikey")) {
        return next(new ErrorHandler("Please Login to access this resource", 401))
    }
    next(new ErrorHandler("Demo mode: accounts, listings, orders and payments are switched off on this public deployment", 503))
}

module.exports = { isDemoMode, queryProducts, findProduct, demoGuard }
