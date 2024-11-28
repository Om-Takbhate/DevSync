const mongoose = require('mongoose')

const connectToDB = async ()=>{
    await mongoose.connect(process.env.dbConnectionString)
}


module.exports = {
    connectToDB
}