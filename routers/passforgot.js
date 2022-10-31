// require("dotenv").config();
// const express = require("express");
// // const Patient = require("../schemas/patient");
// // const Hospital = require("../schemas/hospital");

// const router = new express.Router();

// // // // password for patient
// // // router.post('/patinet/passwordforgot',async(req,res,next) =>
// // // {    
// // //     const account = await Patient.findOne({email: req.body.email});
    
// // //     if(account){
// // //     try{    
// // //             // console.log(useremail.otp_val)
// // //            const transporter = nodemailer.createTransport({
// // //                  service:"gmail",
// // //                  auth:{
// // //                      user : process.env.AUTHEREMAIL,
// // //                      pass: process.env.AUTHERPASS
// // //                  }
// // //              });
// // //              const mailOptions = {
// // //                  from:process.env.AUTHEREMAIL,
// // //            to: account.email,
// // //   subject: 'password forgot',
// // //   text: "Your new password is below \n"+account.password,
// // //        };
// // //              transporter.sendMail(mailOptions,function(error,info){
// // //                  if(error)
// // //                  {
// // //                      console.log(error);
// // //                  }
// // //                  else
// // //                  {
// // //                      console.log("OTP sent");
// // //                  }
// // //             })
// // //              res.status(201).send("OTP has been sent to your related email")
// // //             }catch(err)
// // //             {
// // //               res.status(400).send(err);
// // //             }
// // //     }
// // //     else
// // //     {
// // //         res.send("Invalid email")
// // //     }
// // //  })

// // //  // password for patient
// // // router.post('/hospital/passwordforgot',async(req,res,next) =>
// // // {    
// // //     const account = await Hospital.findOne({email: req.body.email});
    
// // //     if(account){
// // //     try{    
// // //             // console.log(useremail.otp_val)
// // //            const transporter = nodemailer.createTransport({
// // //                  service:"gmail",
// // //                  auth:{
// // //                      user : process.env.AUTHEREMAIL,
// // //                      pass: process.env.AUTHERPASS
// // //                  }
// // //              });
// // //              const mailOptions = {
// // //                  from:process.env.AUTHEREMAIL,
// // //            to: account.email,
// // //   subject: 'password forgot',
// // //   text: "Your new password is below \n"+account.password,
// // //        };
// // //              transporter.sendMail(mailOptions,function(error,info){
// // //                  if(error)
// // //                  {
// // //                      console.log(error);
// // //                  }
// // //                  else
// // //                  {
// // //                      console.log("OTP sent");
// // //                  }
// // //             })
// // //              res.status(201).send("OTP has been sent to your related email")
// // //             }catch(err)
// // //             {
// // //               res.status(400).send(err);
// // //             }
// // //     }
// // //     else
// // //     {
// // //         res.send("Invalid email")
// // //     }
// // //  })


// // // npm i --save-dev @types/springedge

// // // var params = {
// // //   'apikey': 'thisisyashvardhan', // API Key 
// // //   'sender': 'SEDEMO', // Sender Name 
// // //   'to': [
// // //     '917906962743'  //Moblie Number 
// // //   ],
// // //   'message': 'hii'
// // // };

// // // springedge.messages.send(params, 8000, function (err, response) {
// // //   if (err) {
// // //     return console.log(err);
// // //   }
// // //   console.log(response);
// // // })

// // // springedge.messages.send(params, 8000, function (err, response) {
// // //   if (err) {
// // //     return console.log(err);
// // //   }
// // //   console.log(response);
// // // });

// // // app.post("/sendotp", async(req,res)=>{
// //     //   sendMessage(req.body.n,req.body.m,res);
// //     // })
// //     // function sendMessage(n,m,res){
// //     // var options = {
// //     //   authorization : 'Jwnf5WRpNl9LtG7U03du16gyqm42eOz8abAiCvhHkVSQrYIsDccROU23t1Z4Ki7IvakVmLGsQFNplxrg',
// //     //   message: m,
// //     //   numbers: [n]
// //     // };
// //     // // send sms
// //     // fast2sms.sendMessage(options)
    
// //     // .then((response) => res.send("send")) 
// //     // .catch((error) => res.send("not")
// //     // )
// //     // }
// //     // Download the helper library from https://www.twilio.com/docs/node/install
// // // Find your Account SID and Auth Token at twilio.com/console
// // // and set the environment variables. See http://twil.io/secure

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);

// router.get("/otpsend", async(req,res)=>{
// const t={
//     "g":"dfggt",
//     k:343
// }
//     client.messages
//       .create({
//          from: '+12486174750',
//          to: '+919458031015',
//          body: `2321`,
//        })
//       .then(message => res.status(200).send(`msg sent\n ${message}`))
//       .catch((err)=> res.status(401).send(err));

// })

// module.exports = router; 