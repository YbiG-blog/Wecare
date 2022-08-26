require("dotenv").config();
const express = require("express");
const https=require("https");
const router = new express.Router();


router.post("/contact",function(req,res){
    var nm1=req.body.namefst;
    var nm2=req.body.namelst;
    var gm=req.body.gmail;
    var data={
        members:[
            {
                email_address: gm,
                status: "subscribed",
                merge_fields:{
                    FNAME: nm1,
                    LNAME: nm2

                }
            }
        ]
    };

    const jsondata =JSON.stringify(data);
    const url="https://us11.api.mailchimp.com/3.0/lists/490616b314";
    const options= {
        method: "POST",
        auth: "yash:3761cbc3c6b8c63904599a19fdca72ae-us11"
    }

   const request= https.request(url,options,function(rs)
    {
        if(rs.statusCode==200)
        {
            res.send("success");
        }
        else
        {
            res.send("fail");
        }
        rs.on("data",function(data)
        {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsondata);
    request.end();
});

module.exports = router;