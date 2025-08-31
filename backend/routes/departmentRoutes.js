// routes are defined in this file

const express=require('express');
const router=express.Router();

// now import student controller here
const departmentController=require('../controller/departmentController')

// now mount api or send req
router.get('/',departmentController.getDepartments);

module.exports=router;

