const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users) {
        return res.status(400).json({message: "no users found"})
    }
    res.json(users)
})

// @desc Create a user
// @route POST /users
// @access Private

const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles} = req.body

    // Confirm data
    if( !username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({message: "all fields are required"})
    } 

    // Check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: "duplicate user"})
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10) //salt rounds
    const userObject = { username, "password": hashedPwd, roles}

    // Create and store user

    const user = await User.create(userObject)

    if (user) { //created
        res.status(201).json({ message: `New User ${username} created`})
    } else {
        res.status(400).json({message: 'Invalid user data received'})
    }
})

module.exports = {
    getAllUsers,
    createNewUser
}