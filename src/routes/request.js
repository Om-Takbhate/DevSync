const express = require('express')
const requestRouter = express.Router()
const userAuth = require('../middlewares/auth.js')


requestRouter.post('/sendConnectionRequest',userAuth,(req,res)=>{
    let user = req.user
    //sending request logic
    res.send(`Connection request sent by ${user.firstName}`)
})



module.exports = requestRouter