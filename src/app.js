require('dotenv').config()
const express = require('express')
const {connectToDB} = require('./config/database.js')
require('./config/database')
const {User} = require('./models/user.js')


const app = express()

app.use(express.json())

 

app.post('/signup',async (req,res)=>{
    let user = new User(req.body)
    await user.save()
    console.log('User saved!');
    res.send('User saved successfully')
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