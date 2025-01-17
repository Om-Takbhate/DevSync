const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId  ,
        required : true,
        ref : "User"
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true ,
        ref : "User"  
    },
    status : {
        type : String,
        required : true,
        enum : {
            values : ["interested" , "ignored" , "accepted" , "rejected"],
            message : `{VALUE} is invalid status request`
        }
    }
},{timestamps : true})


connectionRequestSchema.index({ fromUserId : 1 , toUserId : 1})

connectionRequestSchema.pre('save',function (){
    //check if user is sending request to himself/herself
    const connectionRequest = this
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error('You cannot send request to yourself')
    }
})

const ConnectionRequest = mongoose.model("ConnectionRequest",connectionRequestSchema)

module.exports = {
    ConnectionRequest
}
