const express = require('express')
const  router = express.Router();
const controller = require('../controllers/studentrecords')

router.post('/',controller.saveStudentRecord)

module.exports = router