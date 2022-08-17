require("dotenv").config();
const express = require("express");
const Patient = require("../schemas/patient");
const Hospital = require("../schemas/hospital");

const router = new express.Router();

// password for patient
router.post('/patinet/passwordforgot',async(req,res,next) =>
{    
    const account = await Patient.findOne({email: req.body.email});
    
    if(account){
    try{    
            // console.log(useremail.otp_val)
           const transporter = nodemailer.createTransport({
                 service:"gmail",
                 auth:{
                     user : process.env.AUTHEREMAIL,
                     pass: process.env.AUTHERPASS
                 }
             });
             const mailOptions = {
                 from:process.env.AUTHEREMAIL,
           to: account.email,
  subject: 'password forgot',
  text: "Your new password is below \n"+account.password,
       };
             transporter.sendMail(mailOptions,function(error,info){
                 if(error)
                 {
                     console.log(error);
                 }
                 else
                 {
                     console.log("OTP sent");
                 }
            })
             res.status(201).send("OTP has been sent to your related email")
            }catch(err)
            {
              res.status(400).send(err);
            }
    }
    else
    {
        res.send("Invalid email")
    }
 })

 // password for patient
router.post('/hospital/passwordforgot',async(req,res,next) =>
{    
    const account = await Hospital.findOne({email: req.body.email});
    
    if(account){
    try{    
            // console.log(useremail.otp_val)
           const transporter = nodemailer.createTransport({
                 service:"gmail",
                 auth:{
                     user : process.env.AUTHEREMAIL,
                     pass: process.env.AUTHERPASS
                 }
             });
             const mailOptions = {
                 from:process.env.AUTHEREMAIL,
           to: account.email,
  subject: 'password forgot',
  text: "Your new password is below \n"+account.password,
       };
             transporter.sendMail(mailOptions,function(error,info){
                 if(error)
                 {
                     console.log(error);
                 }
                 else
                 {
                     console.log("OTP sent");
                 }
            })
             res.status(201).send("OTP has been sent to your related email")
            }catch(err)
            {
              res.status(400).send(err);
            }
    }
    else
    {
        res.send("Invalid email")
    }
 })

module.exports = router; 