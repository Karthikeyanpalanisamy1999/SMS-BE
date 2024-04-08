const mongoose = require('mongoose')
const StudentRecord = require('../models/studentsrecords')
const StudentRequestValidator = require('../validator/studentRequestValidator')
const { BadRequestError } = require('../customError')
const { STATUS_CODE } = require('../constant')
const  config  = require('../config/mongoose')
const { get } = require('lodash')

const saveStudentRecord = async(req,res)=>{
  try
    {
        const requestBody = get(req,'body')
        const studentName = get(requestBody,'studentName')
        const department = get(requestBody,'department')
        const parentMobile1 = get(requestBody,'parentMobile1')
        const parentMobile2 = get(requestBody,'parentMobile2')
        const studentEmail = get(requestBody,'studentEmail')
        const address = get(requestBody,'address')

        //validation for requestBody
        const validationErrors = 
            StudentRequestValidator.validateStudentSaveRequest(requestBody)

        if(Array.isArray(validationErrors)&&validationErrors.length > 0)
        {
            throw new BadRequestError(
                'validation Failed',
                 STATUS_CODE.BAD_REQUEST,
                 validationErrors
            )
        }
        //connect to mongoDB using config file
        await mongoose.connect(config.mongoDbUri,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })

        const existingStudentRecord = await StudentRecord.findOne({
            studentName:studentName,
            department:department,
            parentMobile1:parentMobile1,
            parentMobile2:parentMobile2,
            studentEmail:studentEmail,
            address:address
        })

        if(!existingStudentRecord)
            {
                const studentrecord = new StudentRecord({
                    studentName:studentName,
                    department:department,
                    parentMobile1:parentMobile1,
                    parentMobile2:parentMobile2,
                    studentEmail:studentEmail,
                    address:address
                })
        
                await studentrecord.save();
                res.status(STATUS_CODE.CREATED).json({
                    message:'Students Records Save Successfull'
                })
            }
            else
            {
                existingStudentRecord.lastupdate = new Date()
                await existingStudentRecord.save();
                res.status(STATUS_CODE.CREATED).json({
                    message:"Student Record already existing"
                })
            }
        //close mongoDB Connection
        await mongoose.disconnect()
        //Respond message
    }
  catch(error)
    {
        if(error instanceof BadRequestError)
        {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                message:error.message,
                errors:error.errors
            })
        }
         // error response
            
         console.error(error)

         res.status(STATUS_CODE.INTERNEL_SERVER_ERROR).json({
            message:'Internal server Error'
         })
    }
    finally{
        //close mongoose connection
        mongoose.connection.close()
    }
}

module.exports = {
    saveStudentRecord
}