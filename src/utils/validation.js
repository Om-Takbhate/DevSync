const validator = require('validator')

const validateSignupData = function(req){
    const {firstName , emailId, password} = req.body

    if(!firstName) {
        throw new Error("First name is required")
    }
    if(!emailId) {
        throw new Error("Enter email id")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Enter correct email id")
    }
    else if(!validator.isStrongPassword(password)) {
        throw new Error("Enter strong password")
    }
}  

const validateProfileEditData = (req)=>{
    const allowedEditFields = ["about","photoUrl","firstName","lastName","skills","gender","age","education"]

    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field))
    
    return isEditAllowed
}


module.exports = {
    validateSignupData,
    validateProfileEditData
}