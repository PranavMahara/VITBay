// Local development server. On Vercel the app is served by api/index.js instead.
const path = require("path")
const dotenv = require("dotenv")

dotenv.config({ path: path.join(__dirname, "config", "config.env") })
dotenv.config({ path: path.join(__dirname, "..", ".env.local") })

const app = require("./app")
const connectDatabase = require("./config/database")

connectDatabase()
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(`MongoDB connection failed: ${err.message}`))

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`API listening on http://localhost:${port}`))
