const crypto = require("crypto")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncError = require("../middleware/catchAsyncError")
const User = require("../models/userModel")
const { sendToken, clearToken } = require("../utils/jwtToken")
const { sendEmail, emailConfigured } = require("../utils/sendEmail")
const { cleanImage } = require("./uploadController")

const pick = (obj, keys) => Object.fromEntries(keys.filter((k) => obj[k] !== undefined).map((k) => [k, obj[k]]))

const register = catchAsyncError(async (req, res, next) => {
    const { name, email, password, hostel, course } = req.body
    if (!name || !email || !password) {
        return next(new ErrorHandler("Name, email and password are required", 400))
    }
    const user = await User.create({ name, email, password, hostel, course })
    sendToken(user, 201, res)
})

const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new ErrorHandler("Enter your email and password", 400))
    }
    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select("+password")
    if (!user || !(await user.comparePassword(password))) {
        return next(new ErrorHandler("Incorrect email or password", 401))
    }
    user.lastActiveAt = new Date()
    await user.save({ validateBeforeSave: false })
    sendToken(user, 200, res)
})

const logout = (req, res) => {
    clearToken(res)
    res.status(200).json({ success: true })
}

// Anonymous visitors get { user: null } rather than a 401, since every page load asks
const me = (req, res) => {
    res.status(200).json({ success: true, user: req.user ? req.user.toPrivate() : null })
}

const updateMe = catchAsyncError(async (req, res, next) => {
    const updates = pick(req.body, ["name", "hostel", "course", "bio"])
    if (req.body.avatar !== undefined) {
        updates.avatar = req.body.avatar ? cleanImage(req.body.avatar) : undefined
        if (req.body.avatar && !updates.avatar) return next(new ErrorHandler("Upload the photo again", 400))
    }
    Object.assign(req.user, updates)
    await req.user.save()
    res.status(200).json({ success: true, user: req.user.toPrivate() })
})

const updatePassword = catchAsyncError(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user._id).select("+password")
    if (!(await user.comparePassword(oldPassword || ""))) {
        return next(new ErrorHandler("Your current password is incorrect", 400))
    }
    user.password = newPassword
    await user.save()
    sendToken(user, 200, res)
})

const forgotPassword = catchAsyncError(async (req, res, next) => {
    if (!emailConfigured()) {
        return next(new ErrorHandler("Password reset by email isn't available yet. Ask an admin to reset it for you.", 503))
    }
    const user = await User.findOne({ email: String(req.body.email || "").toLowerCase().trim() })
    // Same response either way, so the form can't be used to discover who has an account
    const done = () => res.status(200).json({ success: true, message: "If that email has an account, a reset link is on its way." })
    if (!user) return done()

    const resetToken = user.getResetPasswordToken()
    await user.save({ validateBeforeSave: false })

    const base = process.env.FRONTEND_URL || `${req.protocol}://${req.get("host")}`
    const url = `${base}/password/reset/${resetToken}`
    try {
        await sendEmail({
            email: user.email,
            subject: "Reset your VITBay password",
            message: `Hi ${user.name},\n\nUse this link to choose a new password (it expires in 15 minutes):\n${url}\n\nIf you didn't ask for this, you can ignore this email.`,
        })
        done()
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({ validateBeforeSave: false })
        return next(new ErrorHandler("Couldn't send the email, please try again later", 500))
    }
})

const resetPassword = catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } })
    if (!user) return next(new ErrorHandler("This reset link is invalid or has expired", 400))
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords don't match", 400))
    }
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()
    sendToken(user, 200, res)
})

module.exports = { register, login, logout, me, updateMe, updatePassword, forgotPassword, resetPassword }
