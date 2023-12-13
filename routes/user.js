const express=require('express');
const userControllers=require("../controllers/user.js");

const router=express.Router();
router.post("/signup",userControllers.signUp);
router.post("/login",userControllers.logIn);


module.exports=router;