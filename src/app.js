require('dotenv').config()
const express = require('express')
const {connectToDB} = require('./config/database.js')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()

app.use(cors({
    origin: 'https://devsync-ui.onrender.com', // ✅ Allow frontend origin
    credentials: true,
    methods: ['GET','POST','PATCH','UPDATE'],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"] // ✅ Changed string to array
}));
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
    console.log(err)
    res.status(400).send(`Something went wrong - ${err.message}`)
})

connectToDB()
    .then(()=>{
        console.log('DB connected successfuly');
        app.listen(process.env.port || 5000,()=>{
            console.log(`app is listening on port ${process.env.port}`);
        })
    })
    .catch((err)=>{
        console.log(err.message);
    })
