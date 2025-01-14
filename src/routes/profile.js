const express = require('express')
const profileRouter = express.Router()
const {validateProfileEditData} = require('../utils/validation.js')

const userAuth = require('../middlewares/auth.js')

profileRouter.get('/profile/view',userAuth,async (req,res)=>{
    try {
        let user = req.user
        if(!user) throw new Error('Pls loggin first XYZ')
        res.send(user)
    }
    catch(err) {
        next(err)
    }
})

profileRouter.patch('/profile/edit',userAuth,async (req,res) => {
    //validate profile edit data
    
    try{
        if(!validateProfileEditData(req)) {
            throw new Error("Invalid update request")
        } 

        const loggedInUser = req.user
        Object.keys(req.body).forEach(key => (loggedInUser[key] = req.body[key]))

        res.send(`${loggedInUser.firstName} your profile is update successfully`)

        
    }
    catch(err) {
        res.status(400).send(err.message)
    }

})

module.exports = profileRouter