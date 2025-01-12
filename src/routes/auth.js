const express = require('express')
const authRouter = express.Router()
const {User} = require('../models/user.js')
const {validateSignupData} = require('../utils/validation.js')
const bcrypt = require('bcrypt')


authRouter.post('/signup',async (req,res,next)=>{
    try{
        
        //extract the data
        const {firstName,lastName,emailId,password} = req.body
        
        //validate user data
        validateSignupData(req)

        //hash the password
        const hashPassword = await bcrypt.hash(password,10)

        //saving the document of user with hashed password value
        let user = new User({
            firstName,lastName,emailId,password:hashPassword
        })
    
        await user.save()
        res.send('User saved successfully')
    }
    catch(err){
        res.status(400).send(err.message)
    }
})


//login route
authRouter.post('/login',async (req,res)=>{
    try {
        const {emailId,password} = req.body

        //check if user exists with given email id
        let user = await User.findOne({emailId : emailId})
        if(!user) throw new Error(`Invalid credentials`)
        
        //compare the stored hash for respective emailId as password with the hash for the given password for logging in
        //since the comparing password is the closely related method to userSChema so we attach the validatePassword method to userSchema in user.js in models
        let isMatch = await user.validatePassword(password)
        if(!isMatch) throw new Error('Invalid credentials')
        else {
            //password gets matched
            //create a jwt token 
            //this token expires in 20 seconds
            //generating token from userSchema related method .getJWT()
            const token = await user.getJWT()


            //send the jwt token to client by wrapping inside the cookie
            //send the token to client , named as token 
            //setting cookie that will expire in 7 days
            res.cookie('token',token,{expires : new Date(Date.now() + ( 168 * 3600000 ))})
            res.send('Login Successful!!!')
        }
    }
    catch(err) {
        res.status(400).send(err.message)
    }
})


authRouter.post("/logout",(req,res) => {
    res.cookie("token",null,{expires : new Date(Date.now())})
    res.send('Logout successful')
})

module.exports = authRouter