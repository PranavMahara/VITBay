const path = require("path")
const dotenv = require("dotenv")

// CONFIG (local development only; in production use real environment variables)
dotenv.config({ path: path.join(__dirname, "config", "config.env") })

const app = require("./app")
const connectDatabase = require("./config/database")
const cloudinary = require("cloudinary")

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`)
    console.log("Shutting down the server due to uncaught exception")
    process.exit(1)
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

if (process.env.connectionString) connectDatabase()
else console.log("No connectionString set: running in demo mode (read-only sample catalog)")

const server = app.listen(process.env.PORT || 4000, () => {
    console.log(`Server is listening on http://localhost:${process.env.PORT || 4000}`)
})

// Unhandled Promise Rejection // like usually when DB is not connected properly
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`)
    console.log("Shutting down the server due to unhandled Promise Rejection")

    server.close(() => {
        process.exit(1)
    })
})
