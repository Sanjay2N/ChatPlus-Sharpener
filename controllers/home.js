const { request, response } = require("express");

exports.homePage=(request,response)=>{
    response.status(200).sendFile("home.html",{root:"views"});
}
