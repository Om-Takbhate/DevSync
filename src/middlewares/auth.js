const jwt = require('jsonwebtoken')
const { User } = require('../models/user')


const userAuth = async(req,res,next)=>{
    try{


        //extract token from req cookies
        let {token} = req.cookies
        
        //if token is not present
        if(!token) throw new Error('Invalid token present! Pls login again')

        //so the token is present
        //verify the token
        let decodedData = await jwt.verify(token,'DEV@Tinder#123')

        //extract the _id from it
        let {_id} = decodedData

        let user = await User.findById(_id)

        if(!user) throw new Error('Pls login first brother')
        req.user = user
        next()
    }
    catch(err) {
        res.status(400).send(err.message)
    }
}


module.exports = {
    userAuth
}