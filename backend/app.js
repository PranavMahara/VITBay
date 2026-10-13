const express = require("express")
const app = express()

const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")

const connectDatabase = require("./config/database")
const errorMiddleware = require("./middleware/error")

// Running behind Vercel's proxy
app.set("trust proxy", 1)

app.use(helmet({ contentSecurityPolicy: false }))
app.use(express.json({ limit: "4mb" }))
app.use(express.urlencoded({ extended: true, limit: "4mb" }))
app.use(cookieParser())
app.use(fileUpload())

// Brute-force protection on credential endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many attempts, please try again later" },
})
app.use(["/api/v1/login", "/api/v1/register", "/api/v1/password"], authLimiter)

// Make sure the DB is connected before any API handler runs
app.use("/api", async (req, res, next) => {
    try {
        await connectDatabase()
        next()
    } catch (err) {
        next(err)
    }
})

// Route Imports
const product = require("./routes/productRoute")
const user = require("./routes/userRoute")
const order = require("./routes/orderRoute")
const payment = require("./routes/paymentRoute")
app.use("/api/v1", product)
app.use("/api/v1", user)
app.use("/api/v1", order)
app.use("/api/v1", payment)

// Middleware for Errors
app.use(errorMiddleware)

module.exports = app
