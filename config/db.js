const mongoose = require("mongoose")

let cached = global.mongoose
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const username = process.env.MONGODB_USERNAME ? encodeURIComponent(process.env.MONGODB_USERNAME.trim().replace(/^["']|["']$/g, '')) : ""
        const password = process.env.MONGODB_PASSWORD ? encodeURIComponent(process.env.MONGODB_PASSWORD.trim().replace(/^["']|["']$/g, '')) : ""

        if (!username || !password) {
            console.error("MongoDB username or password environment variable is missing!")
            throw new Error("MongoDB credentials are missing from environment variables.")
        }

        const uri = `mongodb+srv://${username}:${password}@cluster0.cpjn6vs.mongodb.net/?appName=Cluster0`

        cached.promise = mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        }).then((mongooseInstance) => {
            console.log('MongoDB has been connected successfully')
            return mongooseInstance
        })
    }

    try {
        cached.conn = await cached.promise
    } catch (error) {
        cached.promise = null
        console.error('MongoDB connection error:', error)
        throw error
    }

    return cached.conn
}

module.exports = { connectDB }