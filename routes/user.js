const express=require('express');
const userControllers=require("../controllers/user");
const passwordController=require("../controllers/forgotPassword");

const router=express.Router();
router.post("/signup",userControllers.signUp);
router.post("/login",userControllers.logIn);

router.post('/forgotpassword',passwordController.forgotPassword);
router.get('/reset/:forgotId', passwordController.ResetpasswordPage);
router.post('/updatepassword',passwordController.updatePassword);

router.get("",userControllers.mainPage);

module.exports=router;