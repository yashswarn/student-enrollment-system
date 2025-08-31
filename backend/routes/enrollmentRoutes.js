// routes me hme router lena pdta h
const express=require('express');
const router=express.Router();

const enrollmentController=require('../controller/enrollmentController')

router.post('/',enrollmentController.studentEnrollment)
router.post('/marks',enrollmentController.studentMarks)
router.get('/coursepopularity',enrollmentController.CoursePopularity);

module.exports=router;