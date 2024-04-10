const express = require('express')
const  router = express.Router();
const controller = require('../controllers/studentrecords')
//route endpoint for post 
router.post('/',controller.saveStudentRecord)
//
router.get('/:rollNo',controller.getStudentByRollNo)
router.put('/:rollNo',controller.updateStudentRecord)

module.exports = router