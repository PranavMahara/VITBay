const mongoose = require("mongoose")
const { REPORT_REASONS } = require("../utils/constants")

// A buyer's rating of a seller, tied to the listing they bought
const reviewSchema = new mongoose.Schema(
    {
        seller: { type: mongoose.Schema.ObjectId, ref: "User", required: true, index: true },
        reviewer: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
        listing: { type: mongoose.Schema.ObjectId, ref: "Listing", required: true },
        rating: { type: Number, required: [true, "Pick a rating"], min: 1, max: 5 },
        comment: { type: String, trim: true, maxLength: 500 },
    },
    { timestamps: true }
)

reviewSchema.index({ listing: 1, reviewer: 1 }, { unique: true })

// Keep the seller's average rating in sync
reviewSchema.statics.recalculate = async function (sellerId) {
    const [stats] = await this.aggregate([
        { $match: { seller: new mongoose.Types.ObjectId(String(sellerId)) } },
        { $group: { _id: "$seller", average: { $avg: "$rating" }, count: { $sum: 1 } } },
    ])
    await mongoose.model("User").updateOne(
        { _id: sellerId },
        { rating: { average: stats ? Math.round(stats.average * 10) / 10 : 0, count: stats ? stats.count : 0 } }
    )
}

const reportSchema = new mongoose.Schema(
    {
        listing: { type: mongoose.Schema.ObjectId, ref: "Listing", required: true },
        reporter: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
        reason: { type: String, enum: REPORT_REASONS, required: [true, "Pick a reason"] },
        details: { type: String, trim: true, maxLength: 500 },
        resolved: { type: Boolean, default: false },
    },
    { timestamps: true }
)

reportSchema.index({ listing: 1, reporter: 1 }, { unique: true })

const Review = mongoose.model("Review", reviewSchema)
const Report = mongoose.model("Report", reportSchema)

module.exports = { Review, Report }
