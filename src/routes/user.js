const express = require('express')
const userAuth = require('../middlewares/auth.js')
const {ConnectionRequest} = require('../models/connectionRequest.js')
const { User } = require('../models/user.js')
const userRouter = express.Router()

const USER_SAFE_DATA = ["firstName","lastName","gender","age","photoUrl","about","skills"]


//get all the pending requests of the loggedin user
userRouter.get('/user/requests/recieved',userAuth, async (req,res) => {
    try {
        const loggedInUser = req.user
        const requests = await ConnectionRequest.find({
            toUserId : loggedInUser._id , 
            status : "interested"
        }).populate("fromUserId",USER_SAFE_DATA)
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
        populate("fromUserId",USER_SAFE_DATA)
        .populate("toUserId",USER_SAFE_DATA)


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

userRouter.get('/user/feed',userAuth,async(req,res)=>{
    try {
        //user must not get his profile in feed
        //user must not get his connections profiles in feed
        //user must not get profile who have sent them request or of users to whom logged in user has sent the request

        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or : [
                {fromUserId : loggedInUser._id},
                {toUserId : loggedInUser._id}
            ]
        }).select("fromUserId , toUserId ")

        

        const hiddeUsersFromFeed = new Set()
        connectionRequests.forEach(request => {
            hiddeUsersFromFeed.add(request.fromUserId)
            hiddeUsersFromFeed.add(request.toUserId)
        })
        
        
        //adding logged in users _id , so that user's profile will not be shown in feed data
        hiddeUsersFromFeed.add(loggedInUser._id)

        //finding users whose _id is not present in hiddenUsersFromFeed
        const feedData = await User.find({
            _id : {$nin : Array.from(hiddeUsersFromFeed)}
        }).select(USER_SAFE_DATA)


        res.send({count : feedData.length , data : feedData})
    }
    catch(err) {
        res.status(400).send({error : err.message})
    }
})

module.exports = userRouter