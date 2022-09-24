require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmail = function sendEmail(to,subject,text) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.AUTHEREMAIL,
          pass: process.env.AUTHERPASS,
        },
      });
  
      const mailOptions = {
        from: process.env.AUTHEREMAIL,
        to: to,
        subject: subject,
        text: text,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("OTP sent");
        }
      });
};
module.exports = sendEmail;