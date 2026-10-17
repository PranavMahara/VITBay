const mongoose = require("mongoose")
const { CATEGORIES, CONDITIONS, STATUSES } = require("../utils/constants")

const listingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Give your listing a title"],
            trim: true,
            minLength: [4, "Title should be at least 4 characters"],
            maxLength: [80, "Title cannot exceed 80 characters"],
        },
        description: {
            type: String,
            required: [true, "Add a short description"],
            trim: true,
            maxLength: [2000, "Description cannot exceed 2000 characters"],
        },
        price: {
            type: Number,
            required: [true, "Set a price (0 if you're giving it away)"],
            min: [0, "Price cannot be negative"],
            max: [500000, "Price looks too high"],
        },
        originalPrice: { type: Number, min: 0, max: 1000000 },
        negotiable: { type: Boolean, default: true },
        category: {
            type: String,
            required: [true, "Pick a category"],
            enum: { values: Object.keys(CATEGORIES), message: "Unknown category" },
        },
        condition: {
            type: String,
            required: [true, "Pick a condition"],
            enum: { values: CONDITIONS, message: "Unknown condition" },
        },
        images: {
            type: [{ url: { type: String, required: true }, pathname: String, _id: false }],
            validate: [(v) => v.length >= 1 && v.length <= 8, "Add between 1 and 8 photos"],
        },
        meetupSpot: { type: String, trim: true, maxLength: 60 },
        status: { type: String, enum: STATUSES, default: "active", index: true },
        seller: { type: mongoose.Schema.ObjectId, ref: "User", required: true, index: true },
        buyer: { type: mongoose.Schema.ObjectId, ref: "User" },
        soldAt: Date,
        views: { type: Number, default: 0 },
        saves: { type: Number, default: 0 },
    },
    { timestamps: true }
)

listingSchema.index({ status: 1, createdAt: -1 })
listingSchema.index({ status: 1, category: 1, createdAt: -1 })
listingSchema.index({ title: "text", description: "text" }, { weights: { title: 5, description: 1 } })

module.exports = mongoose.model("Listing", listingSchema)
