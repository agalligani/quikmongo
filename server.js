const express = require('express')
const path = require('path')
require("dotenv").config({ path: "./config/.env" })
const app = express()
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')


mongoose.set('strictQuery', false) //suppress deprecation msg

const PORT = process.env.PORT || 3500
connectDB()

app.use('/', express.static(path.join(__dirname, '.', 'public')))
app.use('/', require('./routes/root'))
app.use('/users', require('./routes/userRoutes'))
// app.use('/notes', require('./routes/noteRoutes'))

mongoose.connection.once('open', () => {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`)
    })
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    `mongoErrLog.log`)
})