// Create a session token and store it in an httpOnly cookie

const cookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
})

const sendToken = (user, statusCode, res) => {
    const days = Number(process.env.COOKIE_EXPIRE) || 7
    res.status(statusCode)
        .cookie("token", user.getJWTToken(), { ...cookieOptions(), expires: new Date(Date.now() + days * 864e5) })
        .json({ success: true, user: user.toPrivate() })
}

const clearToken = (res) => res.cookie("token", "", { ...cookieOptions(), expires: new Date(0) })

module.exports = { sendToken, clearToken }
