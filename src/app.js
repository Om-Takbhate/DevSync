require('dotenv').config()

const express = require('express')
const app = express()


app.get('/getUserData',(req,res)=>{
    //logic of db call and get user data
    throw new Error('Random error thrown')
    res.send("User data sent")
})

//error handling middleware
app.use((err,req,res,next)=>{
    if(err) {
        res.status(500).send(err.message)
    }
})


app.listen(process.env.PORT,()=>{
    console.log(`app is listening on port ${process.env.PORT}`);
})