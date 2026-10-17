const router = require("express").Router()
const { isAuthenticatedUser: auth, optionalUser } = require("../middleware/auth")

const authCtrl = require("../controllers/authController")
const listings = require("../controllers/listingController")
const users = require("../controllers/userController")
const chat = require("../controllers/chatController")
const { createReview } = require("../controllers/reviewController")
const { uploadImage } = require("../controllers/uploadController")

// Accounts
router.post("/auth/register", authCtrl.register)
router.post("/auth/login", authCtrl.login)
router.post("/auth/logout", authCtrl.logout)
router.get("/auth/me", optionalUser, authCtrl.me)
router.put("/auth/me", auth, authCtrl.updateMe)
router.put("/auth/password", auth, authCtrl.updatePassword)
router.post("/auth/password/forgot", authCtrl.forgotPassword)
router.put("/auth/password/reset/:token", authCtrl.resetPassword)

// Listings
router.get("/stats", listings.getStats)
router.get("/listings", listings.getListings)
router.post("/listings", auth, listings.createListing)
router.get("/listings/:id", optionalUser, listings.getListing)
router.patch("/listings/:id", auth, listings.updateListing)
router.delete("/listings/:id", auth, listings.deleteListing)
router.get("/listings/:id/similar", listings.getSimilar)
router.patch("/listings/:id/status", auth, listings.setStatus)
router.get("/listings/:id/buyers", auth, users.listingBuyers)
router.post("/listings/:id/save", auth, listings.toggleSave)
router.post("/listings/:id/report", auth, listings.reportListing)

// People
router.get("/users/:id", users.getProfile)
router.get("/me/listings", auth, users.myListings)
router.get("/me/saved", auth, users.mySaved)
router.post("/reviews", auth, createReview)

// Messages
router.get("/conversations", auth, chat.listConversations)
router.get("/conversations/unread", auth, chat.unreadCount)
router.post("/conversations", auth, chat.startConversation)
router.get("/conversations/:id", auth, chat.getConversation)
router.post("/conversations/:id/messages", auth, chat.sendMessage)
router.patch("/conversations/:id/offers/:messageId", auth, chat.respondToOffer)

// Photos
router.post("/uploads", auth, uploadImage)

module.exports = router
