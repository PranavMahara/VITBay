const app = require("./app")
const dotenv = require("dotenv")
const connectDatabase = require("./config/database")
const cloudinary = require("cloudinary")

// Handling Uncaught Exception  // like console.log(youtube) // youtube is not defined // Error will be shown if and only if console.log thign is mentioned below the middlware
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`)
    console.log("Shutting down the server due to uncaught exception")
    process.exit(1);
})

// CONFIG
dotenv.config({ path: "../backend/config/config.env" })
connectDatabase()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const server = app.listen(process.env.PORT, () => {
    console.log(`Server is listening on http://localhost:${process.env.PORT}`)
})

// Unhandled Promise Rejection // like usually when DB is not connected properly
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`)
    console.log("Shutting down the server due to unhandled Promise Rejection")

    server.close(() => {
        process.exit(1)
    })
})