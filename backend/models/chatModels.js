const mongoose = require("mongoose")

// One conversation per (listing, buyer). The seller is denormalised for fast inbox queries.
const conversationSchema = new mongoose.Schema(
    {
        listing: { type: mongoose.Schema.ObjectId, ref: "Listing", required: true },
        buyer: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
        seller: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
        lastMessage: {
            text: String,
            sender: { type: mongoose.Schema.ObjectId, ref: "User" },
            at: Date,
        },
        unread: {
            buyer: { type: Number, default: 0 },
            seller: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
)

conversationSchema.index({ listing: 1, buyer: 1 }, { unique: true })
conversationSchema.index({ buyer: 1, updatedAt: -1 })
conversationSchema.index({ seller: 1, updatedAt: -1 })

conversationSchema.methods.roleOf = function (userId) {
    const id = String(userId)
    if (String(this.buyer?._id || this.buyer) === id) return "buyer"
    if (String(this.seller?._id || this.seller) === id) return "seller"
    return null
}

const messageSchema = new mongoose.Schema(
    {
        conversation: { type: mongoose.Schema.ObjectId, ref: "Conversation", required: true },
        sender: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
        kind: { type: String, enum: ["text", "offer", "system"], default: "text" },
        text: { type: String, trim: true, maxLength: 1000 },
        offer: {
            amount: { type: Number, min: 0 },
            status: { type: String, enum: ["pending", "accepted", "declined", "withdrawn"] },
        },
    },
    { timestamps: true }
)

messageSchema.index({ conversation: 1, createdAt: 1 })

const Conversation = mongoose.model("Conversation", conversationSchema)
const Message = mongoose.model("Message", messageSchema)

module.exports = { Conversation, Message }
