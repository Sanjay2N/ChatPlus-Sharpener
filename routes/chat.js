const express=require('express');
const chatControllers=require("../controllers/chat.js");
const authentication=require("../middleware/authentication.js");
const multerMiddleware = require('../middleware/multer')
const upload = multerMiddleware.multer.single('image');
const router=express.Router();

router.post("/message",authentication.authorization,chatControllers.sendMessage);
router.post("/image",authentication.authorization,upload,chatControllers.sendImage);
router.get("/messages/:groupId",authentication.authorization,chatControllers.getMessage);
module.exports=router;