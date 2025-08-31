const express=require('express');
const router=express.Router();

const {authenticateToken,authorizeRoles}=require('../middleware/authMiddleware');

router.get('/')