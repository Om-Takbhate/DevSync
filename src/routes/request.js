const express = require('express')
const requestRouter = express.Router()


requestRouter.post('sendConnectionRequest',(req,res)=>{
    let user = req.user
    //sending request logic
    console.log(user.firstName,'sent the request');
})



module.exports = requestRouter