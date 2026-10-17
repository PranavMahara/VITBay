const nodeMailer = require("nodemailer")

const emailConfigured = () => Boolean(process.env.SMPT_MAIL && process.env.SMPT_PASSWORD)

const sendEmail = async ({ email, subject, message }) => {
    const transporter = nodeMailer.createTransport({
        service: process.env.SMPT_SERVICE || "gmail",
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        },
    })

    await transporter.sendMail({
        from: `VITBay <${process.env.SMPT_MAIL}>`,
        to: email,
        subject,
        text: message,
    })
}

module.exports = { sendEmail, emailConfigured }
