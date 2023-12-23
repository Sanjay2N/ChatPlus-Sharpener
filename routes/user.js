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

router.get("/userlist",authentication.authorization,userControllers.getAllUser);
router.post("/creategroup",authentication.authorization,userControllers.createGroup);
router.get("/usergroups",authentication.authorization,userControllers.getUserGroups);
router.get("/group/:groupId",authentication.authorization,userControllers.getGroupDetails);
router.get("/userdetails",authentication.authorization,userControllers.getuserDetails);
router.get("/groupmembers/:groupId",authentication.authorization,userControllers.getGroupMembers);
router.get("/users",authentication.authorization,userControllers.getAllUsers);
router.post("/updategroup/:groupId",authentication.authorization,userControllers.updateGroup);
router.get("/lastseen",authentication.authorization,userControllers.userLastSeens);
router.put("/lastseen/:groupId",authentication.authorization,userControllers.updateUserLastSeen);

router.get("",userControllers.mainPage);

module.exports=router;