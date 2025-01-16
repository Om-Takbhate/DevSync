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
            return res.status(400).send({message : "Connection request already exists"})
        }



        const connectionRequest = new ConnectionRequest({
            fromUserId , toUserId , status
        })

        const data = await connectionRequest.save()
        res.json({message : `Connection request sent successfuly by ${req.user.firstName} ${req.user.lastName}` , data : data})
            
    }
    catch(err) {
        res.status(400).send({message : err.message})
    }
})
        


module.exports = requestRouter