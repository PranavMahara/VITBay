const express = require("express")
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")

const connectDatabase = require("./config/database")
const errorMiddleware = require("./middleware/error")
const ErrorHandler = require("./utils/errorHandler")
const api = require("./routes/api")

const app = express()

// Running behind Vercel's proxy
app.set("trust proxy", 1)
app.disable("x-powered-by")

app.use(helmet({ contentSecurityPolicy: false }))
app.use(express.json({ limit: "100kb" }))
app.use(express.urlencoded({ extended: true, limit: "100kb" }))
app.use(cookieParser())
app.use(fileUpload({ limits: { fileSize: 4 * 1024 * 1024 }, abortOnLimit: true, responseOnLimit: JSON.stringify({ success: false, message: "That photo is too large (max 4 MB)" }) }))

const limiter = (limit, windowMinutes, message) =>
    rateLimit({
        windowMs: windowMinutes * 60 * 1000,
        limit,
        standardHeaders: true,
        legacyHeaders: false,
        message: { success: false, message },
    })

// Brute-force and spam protection
app.use(["/api/v1/auth/login", "/api/v1/auth/register", "/api/v1/auth/password"], limiter(30, 15, "Too many attempts, please try again in a few minutes"))
app.use("/api/v1/uploads", limiter(60, 15, "Too many uploads, slow down a little"))
app.post("/api/v1/conversations*", limiter(120, 5, "You're sending messages too fast"))

// API responses are personalised, so browsers and the CDN must not cache them by default
app.use("/api", (req, res, next) => {
    res.set("Cache-Control", "no-store")
    next()
})

// Make sure the database is connected before any handler runs
app.use("/api", async (req, res, next) => {
    try {
        await connectDatabase()
        next()
    } catch (err) {
        console.error("Database connection failed:", err.message)
        next(new ErrorHandler("VITBay is having trouble reaching its database. Please try again in a minute.", 503))
    }
})

// Also hit daily by a Vercel cron so the free Atlas cluster never looks idle and gets paused
app.get("/api/v1/health", async (req, res, next) => {
    try {
        await require("mongoose").connection.db.admin().ping()
        res.json({ success: true })
    } catch (err) {
        next(new ErrorHandler("Database ping failed", 503))
    }
})
app.use("/api/v1", api)

app.use("/api", (req, res, next) => next(new ErrorHandler("Not found", 404)))
app.use(errorMiddleware)

module.exports = app
