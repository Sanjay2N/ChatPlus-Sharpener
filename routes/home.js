const express=require("express");
const homeControllers=require("../controllers/home");
const router=express.Router();

router.get("/home",homeControllers.homePage);

module.exports=router;