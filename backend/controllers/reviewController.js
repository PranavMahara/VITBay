const ErrorHandler = require("../utils/errorHandler")
const catchAsyncError = require("../middleware/catchAsyncError")
const Listing = require("../models/listingModel")
const { Review } = require("../models/reviewModel")

// POST /reviews  { listingId, rating, comment }  only the recorded buyer of a sold listing can review its seller
const createReview = catchAsyncError(async (req, res, next) => {
    const listing = await Listing.findById(req.body.listingId).select("seller buyer status")
    if (!listing) return next(new ErrorHandler("Listing not found", 404))
    if (listing.status !== "sold" || String(listing.buyer) !== String(req.user._id)) {
        return next(new ErrorHandler("You can review a seller once they mark the item as sold to you", 403))
    }
    const rating = Math.round(Number(req.body.rating))
    if (!(rating >= 1 && rating <= 5)) return next(new ErrorHandler("Pick a rating from 1 to 5", 400))
    if (await Review.exists({ listing: listing._id, reviewer: req.user._id })) {
        return next(new ErrorHandler("You've already reviewed this purchase", 409))
    }

    const review = await Review.create({
        seller: listing.seller,
        reviewer: req.user._id,
        listing: listing._id,
        rating,
        comment: req.body.comment,
    })
    await Review.recalculate(listing.seller)
    res.status(201).json({ success: true, review })
})

module.exports = { createReview }
