const express = require('express')
const profileRouter = express.Router()

const {userAuth} = require('../middlewares/auth.js')

profileRouter.get('/profile',userAuth,async (req,res)=>{
    try {
        let user = req.user
        if(!user) throw new Error('Pls loggin first XYZ')
        res.send(user)
    }
    catch(err) {
        next(err)
    }
})


module.exports = profileRouter