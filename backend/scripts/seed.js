// Fills an empty VITBay database with starter students, listings and reviews.
//   node backend/scripts/seed.js          seed (skips if already seeded)
//   node backend/scripts/seed.js --reset  remove previously seeded data first
// Reads MONGODB_URI from the environment, backend/config/config.env or .env.local.
const path = require("path")
const crypto = require("crypto")
const dotenv = require("dotenv")

dotenv.config({ path: path.join(__dirname, "..", "config", "config.env"), quiet: true })
dotenv.config({ path: path.join(__dirname, "..", "..", ".env.local"), quiet: true })

const mongoose = require("mongoose")
const connectDatabase = require("../config/database")
const User = require("../models/userModel")
const Listing = require("../models/listingModel")
const { Conversation, Message } = require("../models/chatModels")
const { Review } = require("../models/reviewModel")
const { students, listings } = require("./seed-data")
const photos = require("./seed-photos.json")

// Seeded accounts use a reserved domain: they can't receive mail and nobody knows their passwords
const SEED_DOMAIN = "seed.vitbay.invalid"
const DAY = 864e5

// Deterministic pseudo-random numbers, so every seed produces the same numbers
let state = 42
const rand = () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
}
const between = (min, max) => Math.floor(min + rand() * (max - min + 1))

const reset = async () => {
    const seeded = await User.find({ email: new RegExp(`@${SEED_DOMAIN.replace(/\./g, "\\.")}$`) }).select("_id")
    const ids = seeded.map((u) => u._id)
    const theirListings = await Listing.find({ seller: { $in: ids } }).select("_id")
    const listingIds = theirListings.map((l) => l._id)
    const convos = await Conversation.find({ $or: [{ listing: { $in: listingIds } }, { buyer: { $in: ids } }] }).select("_id")
    await Message.deleteMany({ conversation: { $in: convos.map((c) => c._id) } })
    await Conversation.deleteMany({ _id: { $in: convos.map((c) => c._id) } })
    await Review.deleteMany({ $or: [{ seller: { $in: ids } }, { reviewer: { $in: ids } }] })
    await Listing.deleteMany({ _id: { $in: listingIds } })
    await User.updateMany({}, { $pull: { saved: { $in: listingIds } } })
    await User.deleteMany({ _id: { $in: ids } })
    console.log(`Removed ${ids.length} seeded students and ${listingIds.length} listings`)
}

const seed = async () => {
    const now = Date.now()
    const users = {}

    for (const s of students) {
        const createdAt = new Date(now - s.joinedDaysAgo * DAY - between(0, 20) * 3600e3)
        const user = new User({
            name: s.name,
            email: `${s.key}@${SEED_DOMAIN}`,
            password: crypto.randomBytes(24).toString("base64url"),
            hostel: s.hostel,
            course: s.course,
            bio: s.bio,
            verified: s.verified,
            lastActiveAt: new Date(now - between(2, 60 * 30) * 60e3),
            createdAt,
            updatedAt: createdAt,
        })
        await user.save({ timestamps: false })
        users[s.key] = user
    }

    const created = []
    for (const item of listings) {
        const images = item.photos.map((ref) => {
            if (!photos[ref]) throw new Error(`No uploaded photo for ${ref}`)
            return { url: photos[ref], pathname: new URL(photos[ref]).pathname.slice(1) }
        })
        const createdAt = new Date(now - item.ago * DAY - between(1, 20) * 3600e3)
        const age = Math.max(1, item.ago)
        const status = item.status || "active"
        const listing = new Listing({
            title: item.title,
            description: item.description,
            price: item.price,
            originalPrice: item.originalPrice || undefined,
            negotiable: item.negotiable ?? item.price > 0,
            category: item.category,
            condition: item.condition,
            images,
            meetupSpot: item.meetupSpot,
            status,
            seller: users[item.seller]._id,
            buyer: item.buyer ? users[item.buyer]._id : undefined,
            soldAt: status === "sold" ? new Date(createdAt.getTime() + between(1, 4) * DAY) : undefined,
            views: between(6, 18) * Math.min(age, 12) + between(0, 30),
            createdAt,
            updatedAt: createdAt,
        })
        await listing.save({ timestamps: false })
        created.push({ listing, item })
    }

    // Saved items: a few students keep an eye on things they don't own
    const keys = Object.keys(users)
    for (const { listing, item } of created) {
        if (listing.status === "sold") continue
        const n = between(0, 4)
        const savers = keys.filter((k) => k !== item.seller).sort(() => rand() - 0.5).slice(0, n)
        for (const k of savers) users[k].saved.push(listing._id)
        listing.saves = savers.length
        await listing.save({ timestamps: false })
    }
    for (const u of Object.values(users)) await u.save({ timestamps: false })

    // Sold items: the buyer's conversation and their review of the seller
    for (const { listing, item } of created) {
        if (!item.buyer) continue
        const buyer = users[item.buyer]
        const seller = users[item.seller]
        const t0 = listing.createdAt.getTime() + between(2, 20) * 3600e3
        const convo = await Conversation.create({ listing: listing._id, buyer: buyer._id, seller: seller._id })
        const lines = [
            [buyer, `Hi! Is the ${item.title.split(" ·")[0].toLowerCase()} still available?`],
            [seller, "Yes it is. When do you want to see it?"],
            [buyer, `Can we meet at ${item.meetupSpot} tomorrow evening?`],
            [seller, "Sure, 5:30 works. See you there."],
        ]
        for (const [i, [from, text]] of lines.entries()) {
            await new Message({ conversation: convo._id, sender: from._id, text, createdAt: new Date(t0 + i * 25 * 60e3) }).save({ timestamps: false })
        }
        await new Message({ conversation: convo._id, sender: seller._id, kind: "system", text: "marked this item as sold to you. You can now leave a review.", createdAt: listing.soldAt }).save({ timestamps: false })
        await Conversation.updateOne({ _id: convo._id }, { lastMessage: { text: "Item marked as sold", sender: seller._id, at: listing.soldAt }, updatedAt: listing.soldAt }, { timestamps: false })

        if (item.review) {
            const at = new Date(listing.soldAt.getTime() + between(2, 30) * 3600e3)
            await new Review({ seller: seller._id, reviewer: buyer._id, listing: listing._id, ...item.review, createdAt: at, updatedAt: at }).save({ timestamps: false })
        }
    }

    for (const u of Object.values(users)) await Review.recalculate(u._id)
    console.log(`Seeded ${Object.keys(users).length} students and ${created.length} listings`)
}

;(async () => {
    await connectDatabase()
    await Promise.all([User.syncIndexes(), Listing.syncIndexes(), Conversation.syncIndexes(), Message.syncIndexes(), Review.syncIndexes()])
    if (process.argv.includes("--reset")) await reset()
    else if (await User.exists({ email: `${students[0].key}@${SEED_DOMAIN}` })) {
        console.log("Already seeded. Run with --reset to start over.")
        return
    }
    await seed()
})()
    .catch((err) => {
        console.error(err)
        process.exitCode = 1
    })
    .finally(() => mongoose.disconnect())
