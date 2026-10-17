const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

// Emails on these domains get the "verified student" badge
const COLLEGE_DOMAINS = ["vitstudent.ac.in", "vit.ac.in"]

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"],
            trim: true,
            maxLength: [40, "Name cannot exceed 40 characters"],
            minLength: [2, "Name should have at least 2 characters"],
        },
        email: {
            type: String,
            required: [true, "Please enter your email"],
            unique: true,
            lowercase: true,
            trim: true,
            validate: [validator.isEmail, "Please enter a valid email"],
        },
        password: {
            type: String,
            required: [true, "Please enter a password"],
            minLength: [8, "Password should be at least 8 characters"],
            select: false,
        },
        avatar: {
            url: String,
            pathname: String,
        },
        hostel: { type: String, trim: true, maxLength: 40 },
        course: { type: String, trim: true, maxLength: 60 },
        bio: { type: String, trim: true, maxLength: 280 },
        // True for accounts registered with a college email address
        verified: { type: Boolean, default: false },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        saved: [{ type: mongoose.Schema.ObjectId, ref: "Listing" }],
        rating: {
            average: { type: Number, default: 0 },
            count: { type: Number, default: 0 },
        },
        lastActiveAt: { type: Date, default: Date.now },
        resetPasswordToken: { type: String, select: false },
        resetPasswordExpire: { type: Date, select: false },
    },
    { timestamps: true }
)

userSchema.pre("save", function (next) {
    if (this.isModified("email") && COLLEGE_DOMAINS.includes((this.email || "").split("@")[1])) this.verified = true
    next()
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "7d",
    })
}

userSchema.methods.comparePassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex")
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000
    return resetToken
}

// What other students can see about a user
userSchema.methods.toPublic = function () {
    return {
        _id: this._id,
        name: this.name,
        avatar: this.avatar?.url ? { url: this.avatar.url } : undefined,
        hostel: this.hostel,
        course: this.course,
        bio: this.bio,
        verified: this.verified,
        rating: this.rating,
        lastActiveAt: this.lastActiveAt,
        createdAt: this.createdAt,
    }
}

// What the signed-in user sees about themselves
userSchema.methods.toPrivate = function () {
    return { ...this.toPublic(), email: this.email, role: this.role, saved: this.saved }
}

userSchema.statics.PUBLIC_FIELDS = "name avatar.url hostel course verified rating lastActiveAt createdAt"

module.exports = mongoose.model("User", userSchema)
