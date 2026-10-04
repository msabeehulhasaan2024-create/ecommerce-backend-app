require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { connectDB } = require("./config/db")
const auth = require("./routes/auth")
const products = require("./routes/products")
const orders = require("./routes/orders")

const dns = require("dns")
dns.setServers(['1.1.1.1', '8.8.8.8'])

const app = express()

connectDB()

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

app.use("/auth", auth)
app.use("/products", products)
app.use("/orders", orders)

const { PORT = 8000 } = process.env

app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`)
})

module.exports = app