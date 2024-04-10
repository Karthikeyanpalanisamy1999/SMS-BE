const mongoose = require('mongoose')
const {
    connectToMongoDB,
    generateCustomIDs,
} = require('./customIdGenerator') 
const { required } = require('joi')

const Schema =  mongoose.Schema

const studentrecordSchema = new Schema({
    rollNo:{
        type:String,
        required:true
    },
    studentName:{
        type:String,
        required:true
    },
    StudentNo:String,
    department:{
        type:String,
        required:true
    },
    parentMobile1:{
        type:String,
        required:true
    },
    parentMobile2:{
        type:String
    },
    studentEmail:{
        type:String,
        required:true
    },
    address:String,
    lastUpdate:{
        type:Date,
        default:Date.now
    }
})

studentrecordSchema.pre('save', async function (next) {
    if (!this.entityTag) {
        const prefix = 'SRN'
        const seqFieldName = 'studentId'

        try {
            const customIDs = await generateCustomIDs(
                prefix,
                'student',
                seqFieldName
            )
            this.StudentNo = customIDs.customIDReference
            this.StudentId = customIDs.customIDNumber
        } catch (error) {
            console.error('Error generating custom IDs:', error)
            throw error
        }
    }

    next()
})


const StudentRecord = mongoose.model('studentrecord',studentrecordSchema)

module.exports = StudentRecord