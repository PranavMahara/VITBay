const jwt = require("jsonwebtoken")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncError = require("./catchAsyncError")
const User = require("../models/userModel")

const ACTIVE_PING_MS = 5 * 60 * 1000

const userFromRequest = async (req) => {
    const { token } = req.cookies
    if (!token) return null
    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(id)
        if (user && Date.now() - user.lastActiveAt > ACTIVE_PING_MS) {
            User.updateOne({ _id: user._id }, { lastActiveAt: new Date() }).catch(() => {})
        }
        return user
    } catch (_) {
        return null
    }
}

// Rejects the request unless a valid session cookie is present
const isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const user = await userFromRequest(req)
    if (!user) return next(new ErrorHandler("Please log in to continue", 401))
    req.user = user
    next()
})

// Attaches req.user when signed in, but lets anonymous visitors through
const optionalUser = catchAsyncError(async (req, res, next) => {
    req.user = await userFromRequest(req)
    next()
})

const authorizeRoles = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new ErrorHandler("You are not allowed to do that", 403))
    }
    next()
}

module.exports = { isAuthenticatedUser, optionalUser, authorizeRoles }
