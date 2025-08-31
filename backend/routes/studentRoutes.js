const express=require('express');
const router=express.Router();

const studentController=require('../controller/studentController');

router.get('/',studentController.getStudents);
router.post('/add',studentController.addStudents);
router.get('/get',studentController.getAllStudents);
router.get('/for-enrollment',studentController.getStudentsOfDept);
router.get('/for-marks',studentController.getStudentsOfCourse)
router.get('/count',studentController.getCount);
router.get('/getsearchedname',studentController.getSearchedName);
router.delete('/deletestudent/:Student_id',studentController.deleteStudent);

module.exports=router;