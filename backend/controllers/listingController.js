const mongoose = require("mongoose")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncError = require("../middleware/catchAsyncError")
const Listing = require("../models/listingModel")
const User = require("../models/userModel")
const { Conversation, Message } = require("../models/chatModels")
const { Review, Report } = require("../models/reviewModel")
const { listingCard, listingFull, publicUser } = require("../utils/serialize")
const { cleanImage } = require("./uploadController")
const { CATEGORIES } = require("../utils/constants")

const SELLER_FIELDS = User.PUBLIC_FIELDS
const PAGE_SIZE = 24

const SORTS = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { price: 1, createdAt: -1 },
    price_desc: { price: -1, createdAt: -1 },
    popular: { saves: -1, views: -1 },
}

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

// Builds a Mongo filter from the browse page's query string
const buildFilter = (q) => {
    const filter = {}
    filter.status = q.status === "any" ? { $in: ["active", "reserved", "sold"] } : q.status === "sold" ? "sold" : { $in: ["active", "reserved"] }
    if (q.category && CATEGORIES[q.category]) filter.category = q.category
    if (q.condition) filter.condition = { $in: String(q.condition).split(",") }
    const min = Number(q.minPrice)
    const max = Number(q.maxPrice)
    if (q.minPrice !== undefined && q.minPrice !== "" && !Number.isNaN(min)) filter.price = { ...filter.price, $gte: min }
    if (q.maxPrice !== undefined && q.maxPrice !== "" && !Number.isNaN(max)) filter.price = { ...filter.price, $lte: max }
    if (q.free === "1") filter.price = 0
    if (q.seller && mongoose.isValidObjectId(q.seller)) filter.seller = q.seller
    if (q.q) {
        const words = String(q.q).trim().slice(0, 60).split(/\s+/).filter(Boolean).map(escapeRegex)
        filter.$and = words.map((w) => ({ $or: [{ title: { $regex: w, $options: "i" } }, { description: { $regex: w, $options: "i" } }] }))
    }
    return filter
}

// GET /listings
const getListings = catchAsyncError(async (req, res) => {
    const filter = buildFilter(req.query)
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const limit = Math.min(48, Math.max(1, parseInt(req.query.limit, 10) || PAGE_SIZE))
    const sort = SORTS[req.query.sort] || SORTS.newest

    const [items, total] = await Promise.all([
        Listing.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).populate("seller", SELLER_FIELDS),
        Listing.countDocuments(filter),
    ])

    res.status(200).json({
        success: true,
        listings: items.map(listingCard),
        total,
        page,
        pages: Math.max(1, Math.ceil(total / limit)),
    })
})

// GET /listings/:id
const getListing = catchAsyncError(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id).populate("seller", SELLER_FIELDS)
    if (!listing || !listing.seller) return next(new ErrorHandler("This listing doesn't exist or was removed", 404))

    const viewer = req.user?._id ? String(req.user._id) : null
    const isOwner = viewer === String(listing.seller._id)
    if (!isOwner) Listing.updateOne({ _id: listing._id }, { $inc: { views: 1 } }).catch(() => {})

    const [sellerStats, conversation, review] = await Promise.all([
        Listing.aggregate([
            { $match: { seller: listing.seller._id } },
            { $group: { _id: "$status", n: { $sum: 1 } } },
        ]),
        viewer && !isOwner ? Conversation.findOne({ listing: listing._id, buyer: viewer }).select("_id") : null,
        viewer && listing.buyer && String(listing.buyer) === viewer ? Review.findOne({ listing: listing._id, reviewer: viewer }).select("_id") : null,
    ])
    const stats = Object.fromEntries(sellerStats.map((s) => [s._id, s.n]))

    res.status(200).json({
        success: true,
        listing: listingFull(listing),
        seller: { ...publicUser(listing.seller), activeListings: (stats.active || 0) + (stats.reserved || 0), sold: stats.sold || 0 },
        viewer: {
            isOwner,
            saved: Boolean(req.user?.saved?.some((id) => String(id) === String(listing._id))),
            conversationId: conversation?._id,
            canReview: Boolean(viewer && listing.buyer && String(listing.buyer) === viewer && !review),
        },
    })
})

// GET /listings/:id/similar
const getSimilar = catchAsyncError(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id).select("category price seller")
    if (!listing) return next(new ErrorHandler("Listing not found", 404))
    const items = await Listing.find({
        _id: { $ne: listing._id },
        category: listing.category,
        status: "active",
    })
        .sort({ createdAt: -1 })
        .limit(8)
        .populate("seller", SELLER_FIELDS)
    res.status(200).json({ success: true, listings: items.map(listingCard) })
})

const EDITABLE = ["title", "description", "price", "originalPrice", "negotiable", "category", "condition", "meetupSpot"]

const readBody = (body) => {
    const data = {}
    for (const key of EDITABLE) if (body[key] !== undefined) data[key] = body[key]
    if (data.originalPrice === "" || data.originalPrice === null) data.originalPrice = undefined
    if (body.images !== undefined) data.images = (Array.isArray(body.images) ? body.images : []).map(cleanImage).filter(Boolean)
    return data
}

// POST /listings
const createListing = catchAsyncError(async (req, res, next) => {
    const data = readBody(req.body)
    if (!data.images?.length) return next(new ErrorHandler("Add at least one photo", 400))
    if (!data.meetupSpot && req.user.hostel) data.meetupSpot = req.user.hostel

    const recent = await Listing.countDocuments({ seller: req.user._id, createdAt: { $gt: Date.now() - 864e5 } })
    if (recent >= 20) return next(new ErrorHandler("You've posted a lot today. Try again tomorrow.", 429))

    const listing = await Listing.create({ ...data, seller: req.user._id })
    res.status(201).json({ success: true, listing: listingFull(listing) })
})

const ownListing = async (req, next) => {
    const listing = await Listing.findById(req.params.id)
    if (!listing) {
        next(new ErrorHandler("Listing not found", 404))
        return null
    }
    if (String(listing.seller) !== String(req.user._id) && req.user.role !== "admin") {
        next(new ErrorHandler("Only the seller can change this listing", 403))
        return null
    }
    return listing
}

// PATCH /listings/:id
const updateListing = catchAsyncError(async (req, res, next) => {
    const listing = await ownListing(req, next)
    if (!listing) return
    const data = readBody(req.body)
    if (data.images && !data.images.length) return next(new ErrorHandler("Keep at least one photo", 400))
    Object.assign(listing, data)
    await listing.save()
    res.status(200).json({ success: true, listing: listingFull(listing) })
})

// PATCH /listings/:id/status  { status: active | reserved | sold, buyer?: userId }
const setStatus = catchAsyncError(async (req, res, next) => {
    const listing = await ownListing(req, next)
    if (!listing) return
    const { status, buyer } = req.body
    if (!["active", "reserved", "sold"].includes(status)) return next(new ErrorHandler("Unknown status", 400))

    listing.status = status
    if (status === "sold") {
        listing.soldAt = new Date()
        // Only someone who actually messaged about this listing can be recorded as the buyer
        if (buyer) {
            const convo = await Conversation.findOne({ listing: listing._id, buyer })
            if (!convo) return next(new ErrorHandler("Pick a buyer from your conversations", 400))
            listing.buyer = buyer
            await Message.create({ conversation: convo._id, sender: req.user._id, kind: "system", text: "marked this item as sold to you. You can now leave a review." })
            await Conversation.updateOne(
                { _id: convo._id },
                { lastMessage: { text: "Item marked as sold", sender: req.user._id, at: new Date() }, $inc: { "unread.buyer": 1 } }
            )
        }
    } else {
        listing.soldAt = undefined
        listing.buyer = undefined
    }
    await listing.save()
    res.status(200).json({ success: true, listing: listingFull(listing) })
})

// DELETE /listings/:id
const deleteListing = catchAsyncError(async (req, res, next) => {
    const listing = await ownListing(req, next)
    if (!listing) return

    const conversations = await Conversation.find({ listing: listing._id }).select("_id")
    await Promise.all([
        Message.deleteMany({ conversation: { $in: conversations.map((c) => c._id) } }),
        Conversation.deleteMany({ listing: listing._id }),
        Report.deleteMany({ listing: listing._id }),
        User.updateMany({ saved: listing._id }, { $pull: { saved: listing._id } }),
        listing.deleteOne(),
    ])

    // Photos are removed from storage in the background; a failure here shouldn't block the user
    if (process.env.BLOB_READ_WRITE_TOKEN) {
        import("@vercel/blob")
            .then(({ del }) => del(listing.images.map((i) => i.url).filter((u) => u.includes(`/listings/${listing.seller}/`))))
            .catch(() => {})
    }
    res.status(200).json({ success: true })
})

// POST /listings/:id/save  (toggles)
const toggleSave = catchAsyncError(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id).select("_id seller")
    if (!listing) return next(new ErrorHandler("Listing not found", 404))
    const already = req.user.saved.some((id) => String(id) === String(listing._id))
    await Promise.all([
        User.updateOne({ _id: req.user._id }, already ? { $pull: { saved: listing._id } } : { $addToSet: { saved: listing._id } }),
        Listing.updateOne({ _id: listing._id }, { $inc: { saves: already ? -1 : 1 } }),
    ])
    res.status(200).json({ success: true, saved: !already })
})

// POST /listings/:id/report
const reportListing = catchAsyncError(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id).select("_id seller")
    if (!listing) return next(new ErrorHandler("Listing not found", 404))
    if (String(listing.seller) === String(req.user._id)) return next(new ErrorHandler("You can't report your own listing", 400))
    await Report.findOneAndUpdate(
        { listing: listing._id, reporter: req.user._id },
        { reason: req.body.reason, details: req.body.details },
        { upsert: true, runValidators: true, setDefaultsOnInsert: true }
    )
    res.status(200).json({ success: true, message: "Thanks, our moderators will take a look." })
})

// GET /stats  (homepage numbers and category counts)
const getStats = catchAsyncError(async (req, res) => {
    const [byCategory, sold, students] = await Promise.all([
        Listing.aggregate([{ $match: { status: { $in: ["active", "reserved"] } } }, { $group: { _id: "$category", n: { $sum: 1 } } }]),
        Listing.countDocuments({ status: "sold" }),
        User.estimatedDocumentCount(),
    ])
    const categories = Object.fromEntries(byCategory.map((c) => [c._id, c.n]))
    res.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300")
    res.status(200).json({
        success: true,
        active: byCategory.reduce((a, c) => a + c.n, 0),
        sold,
        students,
        categories,
    })
})

module.exports = {
    getListings,
    getListing,
    getSimilar,
    createListing,
    updateListing,
    setStatus,
    deleteListing,
    toggleSave,
    reportListing,
    getStats,
}
