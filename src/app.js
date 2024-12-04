require('dotenv').config()
const express = require('express')
const {connectToDB} = require('./config/database.js')
require('./config/database')
const mongoose = require('mongoose')
const {User} = require('./models/user.js')


const app = express()

app.use(express.json())


//to find a user based on email
app.get('/user',async (req,res)=>{
    let userId = req.body.userId
    try{
        let user = await User.findOne({_id : userId})
        if(!user){
            res.status(404).send(`No user found with email ${userEmail}`)
        }
        else{
            console.log(user.firstName);
            res.send(user)
        }
    }
    catch(err){
        res.status(400).send(`Something went wrong - ${err.message}`)
    }
})

//route for finding all the users
app.get('/feed',async (req,res)=>{
    let userEmail = req.body.emailId
    try{
        let users = await User.find({})
        res.send(users)
    }
    catch(err){
        res.status(400).send(`Something went wrong - ${err.message}`)
    }
})

app.post('/signup',async (req,res,next)=>{
    let user = new User(req.body)
    try{
        await user.save()
        console.log('User saved!');
        res.send('User saved successfully')
    }
    catch(err){
        res.status(400).send(err.message)
    }
})


//delete user api
app.delete('/user',async(req,res)=>{
    let userId = req.body.userId
    try{
        let user = await User.findByIdAndDelete(userId)
        if(!user) res.status(400).send(`No user found with id ${userId}`)
        else res.send('User deleted successfully')
    }
    catch(err){
        next(err)
    }
})


//patch api
app.patch('/user',async (req,res,next)=>{
    let userId = req.body.userId
    try{
        // let user = await User.findOneAndUpdate({_id:userId},req.body)
        // let user = await User.updateOne({_id:userId},req.body)
        let user = await User.findOneAndUpdate({_id:userId},req.body,{returnDocument:'after',runValidators:true})
        if(!user){
            res.status(404).send(`No user found with id ${userId}`)
        }
        else{
            console.log(user);
            res.send('User updated successfully')
        }
    }
    catch(err){
        next(err)
    }
})


app.use((err,req,res,next)=>{
    res.status(400).send(`Something went wrong - ${err.message}`)
})

connectToDB()
    .then(()=>{
        console.log('DB connected successfuly');
        app.listen(process.env.port,()=>{
            console.log(`app is listening on port ${process.env.port}`);
        })
    })
    .catch((err)=>{
        console.log(err.message);
    })