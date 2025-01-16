const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId  ,
        required : true    
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true    
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
