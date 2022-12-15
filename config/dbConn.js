const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI)
        console.log("Mongoose database connected")
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectDB