const validator = require('validator')

const validateSignupData = (req)=>{
    const {firstName , lastName , emailId, password} = req.body

    if(!firstName) {
        throw new Error("First name is required")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Stupid , enter correct email id")
    }
    else if(!validator.isStrongPassword(password)) {
        throw new Error("Stupid , enter strong password")
        
    }
}

module.exports = {
    validateSignupData
}