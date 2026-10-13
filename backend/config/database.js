const mongoose = require("mongoose")

// Cached across invocations so serverless functions reuse one connection
let connection = null

const connectionDB = async () => {
    if (connection) return connection

    connection = mongoose.connect(process.env.connectionString)
        .then((data) => {
            console.log(`Mongodb connected with server: ${data.connection.host}`)
            return data
        })
        .catch((err) => {
            connection = null
            throw err
        })

    return connection
}

module.exports = connectionDB
