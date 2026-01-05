const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt');


const loginController=require('../controller/loginController')
const {authenticateToken,authorizeRoles}=require('../middleware/authMiddleware');

router.post('/',loginController.formSubmit);
router.get('/viewstudents',authenticateToken,authorizeRoles('admin','teacher'),(req,res)=>{
    res.send("welcome admin or teacher")
})

router.get('/registerstudent'
    ,authenticateToken
    ,authorizeRoles('admin'),(req,res)=>{
    res.send("welcome admin!!");
})

router.get('/recordmarks',authenticateToken,authorizeRoles('teacher'),(req,res)=>{
    res.send("welcome teacher!!");
})

router.get('/studentenrollment',authenticateToken,authorizeRoles('department_admin'),(req,res)=>{
    res.send("welcome department admin!!")
})


module.exports=router;