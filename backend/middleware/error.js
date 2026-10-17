const ErrorHandler = require("../utils/errorHandler")

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal Server Error"

    // Malformed MongoDB id
    if (err.name === "CastError") {
        err = new ErrorHandler("That item could not be found", 404)
    }

    // Validation errors: report the first message, which is what the user needs to fix
    if (err.name === "ValidationError") {
        const first = Object.values(err.errors)[0]
        err = new ErrorHandler(first?.message || "Please check the form", 400)
    }

    // Duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0]
        err = new ErrorHandler(field === "email" ? "An account with this email already exists" : "That already exists", 409)
    }

    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        err = new ErrorHandler("Your session has expired, please log in again", 401)
    }

    if (err.statusCode >= 500) console.error(err)

    res.status(err.statusCode).json({
        success: false,
        message: err.statusCode >= 500 && process.env.NODE_ENV === "production" ? "Something went wrong on our side" : err.message,
    })
}
