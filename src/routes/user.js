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

userRouter.get('/user/connections',userAuth,async (req,res)=>{
    try {
        const loggedInUser = req.user
        const connections = await ConnectionRequest.find({
            $or : [
                {
                    fromUserId : loggedInUser._id,
                    status : "accepted"
                },
                {
                    toUserId : loggedInUser._id,
                    status : "accepted"
                }
            ]
        }).
        populate("fromUserId",["firstName","lastName","age","gender","about","skills","photoUrl"])
        .populate("toUserId",["firstName","lastName","age","gender","about","skills","photoUrl"])


        //we just need data of users that are connected to loggedIn user
        //so modify the connection array that also contains the request info

        const data = connections.map(request => {
            if(request.fromUserId._id.equals(loggedInUser._id)) {
                return request.toUserId
            }
            else{
                return request.fromUserId
            }
        })
        
        res.send({count: data.length , data})
    }
    catch(err) {
        res.status(400).send({error : err.message})
    }
})

module.exports = userRouter