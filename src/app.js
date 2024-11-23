require('dotenv').config()

const express = require('express')
const app = express()



app.use('/test',(req,res)=>{
    res.send('Namaste Dev')
})

app.use('/hello',(req,res)=>{
    res.send('<a href="/hl">This is hello</a>')
})


app.listen(process.env.PORT,()=>{
    console.log(`app is listening on port ${process.env.PORT}`);
})