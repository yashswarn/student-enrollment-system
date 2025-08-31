const express=require('express');
const router=express.Router();

const courseController=require('../controller/courseController')

router.get('/',courseController.getCourses);
router.get('/coursecount',courseController.getCourseCount);
router.get('/activeenrollments',courseController.getActiveEnrollments);

module.exports=router;