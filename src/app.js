require('dotenv').config()

const express = require('express')
const app = express()
const {adminAuth} = require('./middlewares/auth.js')
const {userAuth} = require('./middlewares/auth.js')

app.use('/admin',adminAuth)
// app.use('/user',userAuth)


app.get('/admin/getAllUsers',userAuth,(req,res)=>{
    res.send('Sent all users data')
})

app.get('/admin/deleteAllUsers',(req,res)=>{
    res.send('Deleted all users')
})

app.get('/user/getProfileDetails',userAuth,(req,res)=>{
    res.send('Your profile data')
})

app.get('/user/deleteProfile',userAuth,(req,res)=>{
    res.send('Your profile deleted')
})

app.use('/test',(req,res)=>{
    res.send('Namaste Dev')
})

app.use('/hello',(req,res)=>{
    res.send('<a href="/hl">This is hello</a>')
})


app.listen(process.env.PORT,()=>{
    console.log(`app is listening on port ${process.env.PORT}`);
})