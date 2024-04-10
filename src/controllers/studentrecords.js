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
        const rollNo = get(requestBody,'rollNo')
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
            rollNo:rollNo,
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
                    rollNo:rollNo,
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

const getStudentByRollNo = async(req,res)=>{
    try{
          const rollNo = get(req,'params.rollNo')  
        
          if(!rollNo)
          {
            throw new BadRequestError(
                'RollNo is requires',
                STATUS_CODE.BAD_REQUEST
            )
          }
          //connect mongoDB using configfile
          await mongoose.connect(config.mongoDbUri,{
            useNewUrlParser:true,
            useUnifiedTopology:true
          })
          //find student by rollNo
          const Student = await StudentRecord.findOne({
            rollNo
          })
          if(!Student)
          {
            throw new BadRequestError(
                'Student Not Found',
                STATUS_CODE.BAD_REQUEST
            )
          }
          return res.status(STATUS_CODE.OK).json({
            message:'Student Found Successfully',
            data:{
               Student 
            }
          })
    }
    catch(error) {
            if(error instanceof BadRequestError)
            {
                return res.status(STATUS_CODE.BAD_REQUEST).json({
                    message:error.message,
                    errors:error.errors
                })
            }
            //send error response
            console.error(error)

            res.status(STATUS_CODE.INTERNEL_SERVER_ERROR).json({
                message:"Internal server error"
            })
    }

    finally{
        //close mongoose connection
        mongoose.connection.close()
    }

}


const updateStudentRecord = async (req, res) => {
    try {
        const rollNo = get(req, 'params.rollNo');
        const requestBody = get(req, 'body');
        
        if (!rollNo) {
            throw new BadRequestError(
                'RollNo is required',
                STATUS_CODE.BAD_REQUEST
            );
        }

        if (!requestBody) {
            throw new BadRequestError(
                'Request body is required for updating student details',
                STATUS_CODE.BAD_REQUEST
            );
        }

        // Validation for request body
        const validationErrors = StudentRequestValidator.validateStudentSaveRequest(requestBody);
        if (Array.isArray(validationErrors) && validationErrors.length > 0) {
            throw new BadRequestError(
                'Validation Failed',
                STATUS_CODE.BAD_REQUEST,
                validationErrors
            ); exa
        }

        // Connect to MongoDB using config file
        await mongoose.connect(config.mongoDbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Find student by rollNo
        const existingStudentRecord = await StudentRecord.findOne({ rollNo });

        if (!existingStudentRecord) {
            throw new BadRequestError(
                'Student Not Found',
                STATUS_CODE.BAD_REQUEST
            );
        }

        // Update student details
        existingStudentRecord.set(requestBody);
        existingStudentRecord.lastUpdate = new Date();
        await existingStudentRecord.save();

        res.status(STATUS_CODE.OK).json({
            message: 'Student Record updated successfully'
        });
    } catch (error) {
        if (error instanceof BadRequestError) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                message: error.message,
                errors: error.errors
            });
        }
        
        console.error(error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error'
        });
    } finally {
        // Close mongoose connection
        mongoose.connection.close();
    }
};
const removeStudentByRollNo =  async(req,res)=>{
    try{
        const rollNo = get(req,'params.rollNo')

        if(!rollNo)
        {
            throw new BadRequestError(
                'Rollno is required',
                STATUS_CODE.BAD_REQUEST
            )
        }
        //connect mongoDB using config 
        await mongoose.connect(config.mongoDbUri,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        //delete the student by rollNO
        const student = await StudentRecord.deleteOne({
            rollNo
        })
        if(student.deletedCount==0){
            throw new BadRequestError(
                'Student Not Found',
                STATUS_CODE.BAD_REQUEST
            )
        }
        return res.status(STATUS_CODE.CREATED).json({
            message:'Student deleted Successfully'
        })
    }
    catch(error){
        if(error instanceof BadRequestError)
        {
          return res.status(STATUS_CODE.BAD_REQUEST).json({
            message:error.message,
            errors:error.errors
          })
        }

        //send error response

        console.error(error)
        res.status(STATUS_CODE.INTERNEL_SERVER_ERROR).json({
            message:'Internal server error'
        })
    }
    finally{
        //close the mongoDB connection
        mongoose.connection.close()
    }
}

module.exports = {
    saveStudentRecord,
    getStudentByRollNo,
    updateStudentRecord,
    removeStudentByRollNo
}