const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt');

const registerController=require('../controller/registerController')

router.post('/registerdetails',registerController.formSubmit);

module.exports=router;