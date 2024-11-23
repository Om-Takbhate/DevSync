require('dotenv').config()

const express = require('express')
const app = express()

const port = 7777



app.use('/test',(req,res)=>{
    res.send('Namaste Dev')
})

app.use('/hello',(req,res)=>{
    res.send('<a href="/hl">This is hello</a>')
})


app.listen(port,()=>{
    console.log(`app is listening on port ${port}`);
})