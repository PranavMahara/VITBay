const crypto = require("crypto")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncError = require("../middleware/catchAsyncError")

const TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }
const MAX_BYTES = 4 * 1024 * 1024

// Only photos stored in our own Blob store can be attached to listings and profiles
const isOurBlob = (url) => {
    try {
        const u = new URL(url)
        return u.protocol === "https:" && u.hostname.endsWith(".public.blob.vercel-storage.com")
    } catch (_) {
        return false
    }
}

const cleanImage = (img) => {
    const url = typeof img === "string" ? img : img?.url
    if (!isOurBlob(url)) return null
    return { url, pathname: new URL(url).pathname.slice(1) }
}

// POST /uploads  (multipart, field "image"): stores one photo and returns its public URL
const uploadImage = catchAsyncError(async (req, res, next) => {
    const file = req.files?.image
    if (!file || Array.isArray(file)) return next(new ErrorHandler("Choose one photo to upload", 400))
    const ext = TYPES[file.mimetype]
    if (!ext) return next(new ErrorHandler("Photos must be JPG, PNG or WebP", 415))
    if (file.size > MAX_BYTES) return next(new ErrorHandler("That photo is too large (max 4 MB)", 413))
    if (!process.env.BLOB_READ_WRITE_TOKEN) return next(new ErrorHandler("Photo uploads aren't configured", 503))

    const { put } = await import("@vercel/blob")
    const folder = req.query.kind === "avatar" ? "avatars" : "listings"
    const pathname = `${folder}/${req.user._id}/${crypto.randomBytes(8).toString("hex")}.${ext}`
    const blob = await put(pathname, file.data, {
        access: "public",
        contentType: file.mimetype,
        cacheControlMaxAge: 31536000,
    })
    res.status(201).json({ success: true, image: { url: blob.url } })
})

module.exports = { uploadImage, cleanImage, isOurBlob }
