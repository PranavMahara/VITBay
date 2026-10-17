const ErrorHandler = require("../utils/errorHandler")
const catchAsyncError = require("../middleware/catchAsyncError")
const User = require("../models/userModel")
const Listing = require("../models/listingModel")
const { Review } = require("../models/reviewModel")
const { Conversation } = require("../models/chatModels")
const { listingCard, publicUser } = require("../utils/serialize")

const SELLER_FIELDS = User.PUBLIC_FIELDS

// GET /users/:id  (public profile with listings and reviews)
const getProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) return next(new ErrorHandler("This student isn't on VITBay anymore", 404))

    const [listings, reviews] = await Promise.all([
        Listing.find({ seller: user._id }).sort({ status: 1, createdAt: -1 }).limit(60).populate("seller", SELLER_FIELDS),
        Review.find({ seller: user._id }).sort({ createdAt: -1 }).limit(30).populate("reviewer", SELLER_FIELDS).populate("listing", "title"),
    ])

    res.status(200).json({
        success: true,
        user: publicUser(user),
        listings: listings.map(listingCard),
        reviews: reviews.map((r) => ({
            _id: r._id,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.createdAt,
            reviewer: publicUser(r.reviewer),
            listing: r.listing ? { _id: r.listing._id, title: r.listing.title } : null,
        })),
    })
})

// GET /me/listings
const myListings = catchAsyncError(async (req, res) => {
    const listings = await Listing.find({ seller: req.user._id }).sort({ updatedAt: -1 })
    const counts = await Conversation.aggregate([
        { $match: { listing: { $in: listings.map((l) => l._id) } } },
        { $group: { _id: "$listing", n: { $sum: 1 } } },
    ])
    const chats = Object.fromEntries(counts.map((c) => [String(c._id), c.n]))
    res.status(200).json({
        success: true,
        listings: listings.map((l) => ({ ...listingCard(l), views: l.views, chats: chats[String(l._id)] || 0 })),
    })
})

// GET /me/saved
const mySaved = catchAsyncError(async (req, res) => {
    const listings = await Listing.find({ _id: { $in: req.user.saved } }).populate("seller", SELLER_FIELDS)
    // Keep the order in which they were saved, newest first
    const order = req.user.saved.map(String).reverse()
    listings.sort((a, b) => order.indexOf(String(a._id)) - order.indexOf(String(b._id)))
    res.status(200).json({ success: true, listings: listings.map(listingCard) })
})

// GET /listings/:id/buyers  (people who messaged about a listing, for "mark as sold to...")
const listingBuyers = catchAsyncError(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id).select("seller")
    if (!listing) return next(new ErrorHandler("Listing not found", 404))
    if (String(listing.seller) !== String(req.user._id)) return next(new ErrorHandler("Only the seller can see this", 403))
    const convos = await Conversation.find({ listing: listing._id }).sort({ updatedAt: -1 }).populate("buyer", SELLER_FIELDS)
    res.status(200).json({ success: true, buyers: convos.filter((c) => c.buyer).map((c) => publicUser(c.buyer)) })
})

module.exports = { getProfile, myListings, mySaved, listingBuyers }
