const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")

const isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401))
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decodedData.id)
    next()
})

const authorizeRoles = (...roles) => {
    // req.user contains all the information about a particular user like we used isAuthenticatedUser first usse saari user info mill gyi usmein role bhi aagya
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            // console.log("Hello")
            return next(new ErrorHandler(`Role : ${req.user.role} is not allowed to access this resource`, 403))
        }
        next()
    }
}

module.exports = {
    isAuthenticatedUser,
    authorizeRoles
}