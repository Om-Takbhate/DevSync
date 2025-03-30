const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    firstName : {
        type:String,
        required : [true,"First name is required"],
        minLength : [2,"First name should contain atleast 2 letters"],
        maxLength : 50,
        trim : true
    },
    lastName : {
        type:String,
        maxLength : 50,
        trim : true
    },
    emailId : {
        type:String,
        required:[true,"Email id required"],
        unique : [true,"User already exists with the given email"],
        validate : (email)=>{
            if(!validator.isEmail(email)){
                throw new Error('Invalid email')
            }
        }
    },
    password : {
        type:String,
        required:true,
        validate : (pass)=>{
            if(!validator.isStrongPassword(pass)) throw new Error("Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters")
        }
    },
    age : {
        type:Number,
        default : 18,
        min : 18
    },
    gender : {
        type:String,
        default : "not mentioned",
        enum : {
            values : ["male","female","other","not mentioned"],
            message : `{VALUE} is not a valid gender`
        }
    },
    photoUrl : {
        type:String,
        default : "https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg",
        validate : (url)=>{
            if(!validator.isURL(url)) throw new Error("Enter a valid photo url")
        }
    },
    about : {
        type:String,
        default : "This is default about user",
        maxLength : 100,
        trim : true,
        required: true
    },
    skills : {
        type: [String],
        default : [],
        validate : (skills)=>{
            if(skills.length > 10) throw new Error("Skills should not be greator than 10")
        }
    },
    education: {
        type: [Object],
        default: [],
        validate: (education)=>{
            if(education.length > 2) throw new Error('Cannot add more than 2 educational info')
        }
    }

},{timestamps : true})

userSchema.methods.getJWT = async function() {
    const user = this
    const token = await jwt.sign({_id : user._id } , 'DEV@Tinder#123' , {expiresIn : '7d'})
    return token
}

userSchema.methods.validatePassword = async function(password) {
    const user = this
    if(user == null) return false
    let isPasswordMatching = await bcrypt.compare(password,user.password)
    return isPasswordMatching
}

const User = mongoose.model("User",userSchema)

module.exports = {
    User
}