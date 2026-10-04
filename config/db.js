const mongoose = require("mongoose")

const connectDB = async () => {

    await mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.cpjn6vs.mongodb.net/?appName=Cluster0`)
        .then(() => {
            console.log('MongoDB has been connected successfully')
        })
        .catch((error) => {
            console.error(error)
            console.log('MongoDB not connected')
        })
}

module.exports = { connectDB }