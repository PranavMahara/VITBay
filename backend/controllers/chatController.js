const mongoose = require("mongoose")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncError = require("../middleware/catchAsyncError")
const Listing = require("../models/listingModel")
const User = require("../models/userModel")
const { Conversation, Message } = require("../models/chatModels")
const { publicUser } = require("../utils/serialize")
const { rupees } = require("../utils/format")

const USER_FIELDS = User.PUBLIC_FIELDS

const shapeConversation = (c, me) => {
    const role = c.roleOf(me)
    const other = role === "buyer" ? c.seller : c.buyer
    return {
        _id: c._id,
        role,
        other: publicUser(other),
        listing: c.listing
            ? { _id: c.listing._id, title: c.listing.title, price: c.listing.price, status: c.listing.status, image: c.listing.images?.[0]?.url, buyer: c.listing.buyer ? String(c.listing.buyer) : undefined }
            : null,
        lastMessage: c.lastMessage,
        unread: role ? c.unread[role] : 0,
        updatedAt: c.updatedAt,
    }
}

const shapeMessage = (m) => ({
    _id: m._id,
    sender: String(m.sender),
    kind: m.kind,
    text: m.text,
    offer: m.offer?.amount !== undefined ? m.offer : undefined,
    createdAt: m.createdAt,
})

const loadConversation = async (req, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        next(new ErrorHandler("Conversation not found", 404))
        return null
    }
    const convo = await Conversation.findById(req.params.id)
        .populate("buyer", USER_FIELDS)
        .populate("seller", USER_FIELDS)
        .populate("listing", "title price status images buyer seller")
    if (!convo || !convo.roleOf(req.user._id)) {
        next(new ErrorHandler("Conversation not found", 404))
        return null
    }
    return convo
}

// Appends a message, bumps the conversation and the other side's unread count
const post = async (convo, sender, payload, preview) => {
    const msg = await Message.create({ conversation: convo._id, sender, ...payload })
    const otherRole = convo.roleOf(sender) === "buyer" ? "seller" : "buyer"
    await Conversation.updateOne(
        { _id: convo._id },
        { lastMessage: { text: preview, sender, at: msg.createdAt }, $inc: { [`unread.${otherRole}`]: 1 } }
    )
    return msg
}

const readMessagePayload = (body) => {
    if (body.offer !== undefined && body.offer !== null && body.offer !== "") {
        const amount = Math.round(Number(body.offer))
        if (!Number.isFinite(amount) || amount < 0 || amount > 500000) throw new ErrorHandler("Enter a valid offer amount", 400)
        return { payload: { kind: "offer", offer: { amount, status: "pending" }, text: body.text?.trim() || undefined }, preview: `Offered ${rupees(amount)}` }
    }
    const text = String(body.text || "").trim()
    if (!text) throw new ErrorHandler("Type a message first", 400)
    if (text.length > 1000) throw new ErrorHandler("That message is too long", 400)
    return { payload: { kind: "text", text }, preview: text.slice(0, 120) }
}

// GET /conversations
const listConversations = catchAsyncError(async (req, res) => {
    const me = req.user._id
    const convos = await Conversation.find({ $or: [{ buyer: me }, { seller: me }] })
        .sort({ updatedAt: -1 })
        .limit(100)
        .populate("buyer", USER_FIELDS)
        .populate("seller", USER_FIELDS)
        .populate("listing", "title price status images buyer")
    res.status(200).json({ success: true, conversations: convos.filter((c) => c.buyer && c.seller).map((c) => shapeConversation(c, me)) })
})

// GET /conversations/unread
const unreadCount = catchAsyncError(async (req, res) => {
    const me = req.user._id
    const [asBuyer, asSeller] = await Promise.all([
        Conversation.aggregate([{ $match: { buyer: me } }, { $group: { _id: null, n: { $sum: "$unread.buyer" } } }]),
        Conversation.aggregate([{ $match: { seller: me } }, { $group: { _id: null, n: { $sum: "$unread.seller" } } }]),
    ])
    res.status(200).json({ success: true, unread: (asBuyer[0]?.n || 0) + (asSeller[0]?.n || 0) })
})

// POST /conversations  { listingId, text?, offer? }  starts (or reuses) a chat with the seller
const startConversation = catchAsyncError(async (req, res, next) => {
    const listing = await Listing.findById(req.body.listingId).select("seller status title")
    if (!listing) return next(new ErrorHandler("This listing is no longer available", 404))
    if (String(listing.seller) === String(req.user._id)) return next(new ErrorHandler("This is your own listing", 400))
    if (listing.status === "sold") return next(new ErrorHandler("This item has already been sold", 400))

    const { payload, preview } = readMessagePayload(req.body)
    let convo = await Conversation.findOne({ listing: listing._id, buyer: req.user._id })
    if (!convo) {
        convo = await Conversation.create({ listing: listing._id, buyer: req.user._id, seller: listing.seller })
    }
    await post(convo, req.user._id, payload, preview)
    res.status(201).json({ success: true, conversationId: convo._id })
})

// GET /conversations/:id?after=<iso date>  thread + messages (marks them read)
const getConversation = catchAsyncError(async (req, res, next) => {
    const convo = await loadConversation(req, next)
    if (!convo) return
    const role = convo.roleOf(req.user._id)

    const query = { conversation: convo._id }
    if (req.query.after) query.createdAt = { $gt: new Date(req.query.after) }
    const messages = await Message.find(query).sort({ createdAt: 1 }).limit(500)

    if (convo.unread[role]) await Conversation.updateOne({ _id: convo._id }, { [`unread.${role}`]: 0 })
    res.status(200).json({ success: true, conversation: shapeConversation(convo, req.user._id), messages: messages.map(shapeMessage) })
})

// POST /conversations/:id/messages  { text } or { offer, text? }
const sendMessage = catchAsyncError(async (req, res, next) => {
    const convo = await loadConversation(req, next)
    if (!convo) return
    const role = convo.roleOf(req.user._id)
    const { payload, preview } = readMessagePayload(req.body)
    if (payload.kind === "offer") {
        if (role !== "buyer") return next(new ErrorHandler("Only the buyer can make an offer", 400))
        if (convo.listing?.status === "sold") return next(new ErrorHandler("This item has already been sold", 400))
        // A new offer replaces any earlier one that is still waiting
        await Message.updateMany({ conversation: convo._id, kind: "offer", "offer.status": "pending" }, { "offer.status": "withdrawn" })
    }
    const msg = await post(convo, req.user._id, payload, preview)
    res.status(201).json({ success: true, message: shapeMessage(msg) })
})

// PATCH /conversations/:id/offers/:messageId  { action: accept | decline | withdraw }
const respondToOffer = catchAsyncError(async (req, res, next) => {
    const convo = await loadConversation(req, next)
    if (!convo) return
    const role = convo.roleOf(req.user._id)
    const msg = await Message.findOne({ _id: req.params.messageId, conversation: convo._id, kind: "offer" })
    if (!msg) return next(new ErrorHandler("Offer not found", 404))
    if (msg.offer.status !== "pending") return next(new ErrorHandler("This offer has already been answered", 400))

    const { action } = req.body
    const allowed = role === "seller" ? ["accept", "decline"] : ["withdraw"]
    if (!allowed.includes(action)) return next(new ErrorHandler("You can't do that with this offer", 403))

    msg.offer.status = { accept: "accepted", decline: "declined", withdraw: "withdrawn" }[action]
    await msg.save()

    const amount = rupees(msg.offer.amount)
    const note = { accept: `accepted the offer of ${amount}. Agree on a time and place to meet.`, decline: `declined the offer of ${amount}.`, withdraw: `withdrew the offer of ${amount}.` }[action]
    await post(convo, req.user._id, { kind: "system", text: note }, `${action === "accept" ? "Accepted" : action === "decline" ? "Declined" : "Withdrew"} offer of ${amount}`)

    // Accepting an offer reserves the item so other buyers know it's spoken for
    if (action === "accept" && convo.listing?.status === "active") {
        await Listing.updateOne({ _id: convo.listing._id }, { status: "reserved" })
    }
    res.status(200).json({ success: true, message: shapeMessage(msg) })
})

module.exports = { listConversations, unreadCount, startConversation, getConversation, sendMessage, respondToOffer }
