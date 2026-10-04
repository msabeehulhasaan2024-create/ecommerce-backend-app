require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { connectDB } = require("./config/db")
const auth = require("./routes/auth")
const products = require("./routes/products")
const orders = require("./routes/orders")

// Only use custom DNS in local environment, NOT on Vercel/serverless
if (!process.env.VERCEL) {
    const dns = require("dns")
    try {
        dns.setServers(['1.1.1.1', '8.8.8.8'])
    } catch (e) {
        console.warn("Could not set custom DNS servers:", e.message)
    }
}

const app = express()

// Health check endpoint
app.get("/", (req, res) => {
    res.status(200).json({ status: "ok", message: "E-commerce Backend is running successfully!" })
})

const allowedOrigins = [
  "https://ecommerce-frontend-app-phi.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL
].filter(Boolean).map(url => url.replace(/\/$/, ""))

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true)

    const normalizedOrigin = origin.replace(/\/$/, "")
    const isAllowed = allowedOrigins.includes(normalizedOrigin) || normalizedOrigin.endsWith(".vercel.app")

    if (isAllowed) {
      return callback(null, true)
    }

    return callback(new Error("CORS policy violation: Access not allowed from this origin."))
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json())

// Ensure DB is connected before handling API requests (vital for Vercel serverless)
app.use(async (req, res, next) => {
    try {
        await connectDB()
        next()
    } catch (err) {
        console.error("Database connection middleware error:", err)
        return res.status(500).json({
            message: "Database connection failed. Please check MONGODB credentials in Vercel environment variables and ensure MongoDB Atlas allows 0.0.0.0/0.",
            error: err.message,
            isError: true
        })
    }
})

app.use("/auth", auth)
app.use("/products", products)
app.use("/orders", orders)

const { PORT = 8000 } = process.env

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on PORT:${PORT}`)
    })
}

module.exports = app