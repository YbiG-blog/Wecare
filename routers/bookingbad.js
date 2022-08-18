const express = require("express");
const router = new express.Router();
const Bad = require("../schemas/bads");
const atob = require("atob");
const verify = require("../middleware/auth");

router.put("/booking", verify, async(req,res)=>{
    const isVerified = true;
    const token = req.body.cookie_token;
    const dec = token.split(".")[1];
    const decode = JSON.parse(atob(dec)); //contains Userid
    console.log(dec);
    
})
module.exports = router;