const express = require('express')
const userAuth = require('../middlewares/auth.js')
const {ConnectionRequest} = require('../models/connectionRequest.js')
const userRouter = express.Router()

//get all the pending requests of the loggedin user
userRouter.get('/user/requests/recieved',userAuth, async (req,res) => {
    try {
        const loggedInUser = req.user
        const requests = await ConnectionRequest.find({
            toUserId : loggedInUser._id , 
            status : "interested"
        }).populate("fromUserId",["firstName" , "lastName","gender","age","photoUrl","about","skills"])
        res.send({count : requests.length , message : requests})
    }
    catch(err) {
        res.status(404).send({error : err.message})
    }
})

module.exports = userRouter