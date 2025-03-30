const express = require('express')
const requestRouter = express.Router()
const {User} = require('../models/user.js')
const {ConnectionRequest} = require('../models/connectionRequest.js')
const userAuth = require('../middlewares/auth.js')


requestRouter.post('/request/send/:status/:toUserId',userAuth,async (req,res)=>{ 
    try{
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status
        
        
        const allowedStatus = ["interested","ignored"]
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({message : "Invalid status type"+status})
        }
        
        const toUser = await User.findById(toUserId)
        if(!toUser) {
            throw new Error(`User not found`)
        }

        //check if there is existing connection request from  fromUserId to toUserId

        
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or : [{fromUserId , toUserId} , {fromUserId : toUserId ,  toUserId : fromUserId}]
        })
        

        //check if user with toUserId is even present in out db or not


        if(existingConnectionRequest) {
            return res.status(400).send({message : "Connection request already exists or already connected"})
        }



        const connectionRequest = new ConnectionRequest({
            fromUserId , toUserId , status
        })

        const data = await connectionRequest.save()
        res.json({message : `Connection request ${status == "ignored" ? "rejected" : "sent"} successfuly to ${toUser.firstName} ${toUser.lastName}` , data : data})
            
    }
    catch(err) {
        res.status(400).send({message : err.message})
    }
})


requestRouter.post('/request/review/:status/:requestId',userAuth,async(req,res) => {
    try{
        //the connectionRequest document must have toUserId equals to id of loggedInUser , then only he can review request
        //validate the status , must be either -> "accepted" or "rejected"
        //status of connectionRequest must be interested , then only loggedInUser can review it

        const loggedInUser = req.user
        const { status } = req.params
        const { requestId } = req.params

        //check if status is valid or not
        const allowedStatus = ["accepted","rejected"]

        if(!allowedStatus.includes(status)) {
            throw new Error("Invalid status")
        }
        
        
        //check if is there any request with requestId in connectionRouter
        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId : loggedInUser._id,
            status : "interested"
        })

        //if request id not found
        if(!connectionRequest) {
            throw new Error("No connection request found!")
        }

        //if request is found
        connectionRequest.status = status
        await connectionRequest.save()

        res.send({message : 'Connection request '+status})
    }
    catch(err) {
        res.status(400).send({error : err.message})
    }
})
        


module.exports = requestRouter