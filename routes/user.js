const express=require('express');
const userControllers=require("../controllers/user");
const passwordController=require("../controllers/forgotPassword");
const authentication=require("../middleware/authentication.js");


const router=express.Router();
router.post("/signup",userControllers.signUp);
router.post("/login",userControllers.logIn);

router.post('/forgotpassword',passwordController.forgotPassword);
router.get('/reset/:forgotId', passwordController.ResetpasswordPage);
router.post('/updatepassword',passwordController.updatePassword);

router.get("/getuserlist",authentication.authorization,userControllers.getAllUser);
router.post("/creategroup",authentication.authorization,userControllers.createGroup);
router.get("/usergroups",authentication.authorization,userControllers.getUserGroups);
router.get("/group/:groupId",authentication.authorization,userControllers.getGroupDetails);
router.get("/getuserdetails",authentication.authorization,userControllers.getuserDetails);
router.get("/groupmembers/:groupId",authentication.authorization,userControllers.getGroupMembers);
router.get("/getusers",authentication.authorization,userControllers.getAllUsers);
router.post("/updategroup/:groupId",authentication.authorization,userControllers.updateGroup);







router.get("",userControllers.mainPage);

module.exports=router;