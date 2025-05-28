const express = require('express')
const userAuth = require('../middlewares/auth.js')
const {ConnectionRequest} = require('../models/connectionRequest.js')
const { User } = require('../models/user.js')
const userRouter = express.Router()

const USER_SAFE_DATA = ["firstName","lastName","gender","age","photoUrl","about","skills"]


//get all the pending requests of the loggedin user
userRouter.get('/user/requests/recieved',userAuth, async (req,res) => {
    try {
        const {page} = req.query || 1
        const limit = 10
        const loggedInUser = req.user
        const requests = await ConnectionRequest.find({
            toUserId : loggedInUser._id , 
            status : "interested"
        })
        .populate("fromUserId",USER_SAFE_DATA)
        res.send({count : requests.length , data : requests})
    }
    catch(err) {
        res.status(404).send({error : err.message})
    }
})

userRouter.get('/user/connections',userAuth,async (req,res)=>{
    try {
        let {page} = req.query || 1
        const limit = 10
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
        }).skip((page - 1) * limit).limit(limit)
        .populate("fromUserId",USER_SAFE_DATA)
        .populate("toUserId",USER_SAFE_DATA)
        .sort({createdAt: -1})


        //we just need data of users that are connected to loggedIn user
        //so modify the connection array that also contains the request info

        const data = connections.map(request => {
            if(request?.fromUserId?._id?.equals(loggedInUser._id)) {
                return request.toUserId
            }
            else{
                return request.fromUserId
            }
        })
        
        res.send({count: data.length , data})
    }
    catch(err) {
        console.log(err)
        res.status(400).send({error : err.message})
    }
})

userRouter.get('/user/feed',userAuth,async(req,res)=>{
    try {
        //user must not get his profile in feed
        //user must not get his connections profiles in feed
        //user must not get profile who have sent them request or of users to whom logged in user has sent the request

        const pageNo = req.query?.page || 1
        const limit = 10
        
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
        }).select("fromUserId , toUserId ").select(USER_SAFE_DATA).skip((pageNo - 1) * limit).limit(limit)

        //implementing pagination



        res.send({count : feedData.length , data : feedData})
    }
    catch(err) {
        res.status(400).send({error : err.message})
    }
})

userRouter.get('/user/search', async(req,res) => {
    const name = req.query?.name

    const nameParts = name.trim().split(/\s+/)
    console.log(nameParts);
    
    if(nameParts.length == 0 || nameParts[0] == '') return res.send({
        message: "No search query given"
    })
    

    let result ;
    if(nameParts.length == 1) {
        const searchTerm = nameParts[0]

        result = await User.find({
            $or: [
                { firstName: {$regex: searchTerm, $options: 'i'}},
                { lastName: {$regex: searchTerm, $options: 'i'}}
            ]
        }).select("-password -emailId")
    }
    else {
        const firstName = nameParts[0]
        const lastName = nameParts[nameParts.length - 1]
        
        result = await User.find({
            $or: [
                { firstName: {$regex: firstName, $options: 'i'}},
                { lastName: {$regex: lastName, $options: 'i'}}
            ]            
        }).select("-password -emailId")
        
    }

    res.send({
        message: `Fetched users with name ${name}`,
        data: result

    })

})

module.exports = userRouter