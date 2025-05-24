const express = require('express')
const profileRouter = express.Router()
const bcrypt = require('bcrypt')
const { validateProfileEditData } = require('../utils/validation.js')
const { User } = require('../models/user.js')
const { ConnectionRequest } = require('../models/connectionRequest.js')
const userAuth = require('../middlewares/auth.js')

profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        let user = req.user
        if (!user) throw new Error('Pls loggin first XYZ')
        res.send(user)
    }
    catch (err) {
        next(err)
    }
})

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    //validate profile edit data

    try {
        if (!validateProfileEditData(req)) {
            throw new Error("Invalid update request")
        }


        const loggedInUser = req.user

        Object.keys(req.body).forEach(key => (loggedInUser[key] = req.body[key]))
        if (Object.keys(req.body).includes("skills")) {
            const skillsArr = req.body.skills.split(',')
            loggedInUser['skills'] = skillsArr

        }
        if (Object.keys(req.body).includes('education')) {
            loggedInUser['education'] = req.body.education
        }
        let user = await User.findByIdAndUpdate(loggedInUser._id, loggedInUser, { runValidators: true, returnDocument: 'after' })
        req.user = user
        res.send({ user, message: 'Your profile has been updated successfuly' })

    }
    catch (err) {
        res.status(400).send(err.message)
    }
})

profileRouter.get('/profile/:id', userAuth, async (req, res, next) => {
    const loggedInUser = req.user
    const { id } = req.params
    try {
        const user = await User.findById(id).select('firstName about lastName gender photoUrl skills education')
        if (!user) {
            return res.status(400).send({
                message: "No user found"
            })
        }
        const connectionRequest = await ConnectionRequest.findOne({
            $or: [
                {
                    fromUserId: loggedInUser._id,
                    toUserId: id,
                    status: "accepted"
                },
                {
                    fromUserId: id,
                    toUserId: loggedInUser._id,
                    status: "accepted"
                }
            ]
        })

        res.send({
            data: user,
            isConnected: connectionRequest != null
        })
    }
    catch (err) {
        next(err)
    }
})


//password edit route
profileRouter.patch('/profile/edit/password', userAuth, async (req, res) => {
    try {
        let { currentPassword, newPassword } = req.body
        let isPasswordMatch = await bcrypt.compare(currentPassword, req.user.password)
        if (!isPasswordMatch) throw new Error('Invalid Credentials! Failed to update the password')

        //password is correct
        let newHashedPassword = await bcrypt.hash(newPassword, 11)
        let user = await User.findByIdAndUpdate(req.user._id, { password: newHashedPassword }, { returnDocument: 'after' })
        res.cookie("token", null, { expires: new Date(Date.now()) })
        res.json({ data: "password updated successful", data: user })

    }
    catch (err) {
        res.status(400).send({ error: err.message })
    }
})

module.exports = profileRouter