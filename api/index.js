// Vercel serverless entry: the whole Express API runs as one function
const cloudinary = require("cloudinary")
const app = require("../backend/app")

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

module.exports = app
