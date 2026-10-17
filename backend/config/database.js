const mongoose = require("mongoose")

// One cached connection per function instance, so warm serverless invocations reuse it
let connection = null

const connectDatabase = async () => {
    if (connection) return connection

    const uri = process.env.MONGODB_URI || process.env.connectionString
    if (!uri) throw new Error("MONGODB_URI is not set")

    connection = mongoose
        .connect(uri, { dbName: process.env.MONGODB_DB || "vitbay", maxIdleTimeMS: 10000, serverSelectionTimeoutMS: 10000 })
        .then((m) => {
            // Lets Vercel close idle sockets cleanly when a function instance is suspended
            try {
                const { attachDatabasePool } = require("@vercel/functions")
                attachDatabasePool(m.connection.getClient())
            } catch (_) { /* not on Vercel */ }
            return m
        })
        .catch((err) => {
            connection = null
            throw err
        })

    return connection
}

module.exports = connectDatabase
