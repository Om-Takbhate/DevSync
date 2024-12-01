require('dotenv').config()
const express = require('express')
const {connectToDB} = require('./config/database.js')
require('./config/database')
const {User} = require('./models/user.js')


const app = express()

app.use(express.json())

 

app.post('/signup',async (req,res)=>{
    // let {firstName,lastName,emailId,password,age,gender} = req.body
    req.body.hi = "hi"
    console.log(req.body);
    //wrap inside try-catch block
    // try{
    //     let user = new User({firstName,lastName,emailId,password,age,gender})
    //     console.log(user);
    //     await user.save()
    //     console.log('user saved to collection');
    //     res.send('User data saved')
    // }
    // catch(err){
    //     res.status(400).send('Error while saving the user')
    // }
    res.send('')
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