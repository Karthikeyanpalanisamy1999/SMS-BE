const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const config = require('./config/mongoose')
const bodyParser = require('body-parser')
const { STATUS_CODE } = require('./constant')
const studentrecords = require('./routes/studentrecords')

const app = express();
dotenv.config();

app.use(express.json())
app.use(bodyParser.json())

//mongoDB connection

mongoose.connect(config.mongoDbUri,{})
const db = mongoose.connection;

db.on('error',(err)=>{
    console.error('connection error:',err)
})
db.once('open',()=>{
    console.log("Connect MongoDB Successfully")
})
//route health check
app.get('/',(req,res)=>{
    res.status(STATUS_CODE.OK).send('Hello World')
})
app.use('/student-record',studentrecords)
//Error handling
app.use((req,res)=>{
    const error = new Error('URL Not Found')
    res.status(STATUS_CODE.NOT_FOUND).json({
        message: error.message
    })

})
app.listen(config.port,config.hostname,()=>{
    console.log(`Server running on http://${config.hostname}:${config.port}`)
})
