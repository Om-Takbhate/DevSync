require('dotenv').config()
const express = require('express')
const {connectToDB} = require('./config/database.js')
require('./config/database')
const {User} = require('./models/user.js')

const app = express()


app.post('/signup',async (req,res)=>{
    //creating new instance of User model
    const user = new User({
        firstName : "Virat",
        lastName : "Kohi",
        emailId : "viratkohli@gmail.com",
        password : "viratkohli@123",
        age:32,
        gender : "male"
    })

    //wrap inside try-catch block
    try{
        await user.save()
        console.log('user saved to collection');
        res.send('User data saved')
    }
    catch(err){
        res.status(400).send('Error while saving the user')
    }
})



connectToDB()
    .then(()=>{
        console.log('DB connected successfuly');
        app.listen(process.env.port,()=>{
            console.log(`app is listening on port ${process.env.port}`);
        })
    })
    .catch((err)=>{
        console.log('Something went wrong - ',err.message);
    })