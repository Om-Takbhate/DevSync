require('dotenv').config()
const express = require('express')
const {connectToDB} = require('./config/database.js')
const cookieParser = require('cookie-parser')


const app = express()

app.use(express.json())
app.use(cookieParser())


const authRouter = require('./routes/auth.js')
const profileRouter = require('./routes/profile.js')
const requestRouter = require('./routes/request.js')
const userRouter = require('./routes/user.js')

app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',requestRouter)
app.use('/',userRouter)

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