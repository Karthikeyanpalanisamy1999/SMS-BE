const express = require('express')
const  router = express.Router();
const controller = require('../controllers/studentrecords')
//route endpoint for post 
router.post('/',controller.saveStudentRecord)
//route endpoint for get
router.get('/:rollNo',controller.getStudentByRollNo)
//route endpoint for put
router.put('/:rollNo',controller.updateStudentRecord)
module.exports = router