require("dotenv").config();
const express = require("express")
const cookieParser = require("cookie-parser");
const registerRouter = require("./routers/register");
const loginRouter = require("./routers/login");
const getAll = require("./routers/getall")
const addBeds = require("./routers/addbeds");
const availableBeds = require("./routers/availablebeds");
const bookingBed = require("./routers/bookingbed")
const newsLatter = require("./newslatter");
const cors  = require('cors');

require("./database/database");

const app = express();

app.use(express.json());
// app.use(cookieParser());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTION,GET,POST,PUT,PATCH,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.get("/", (req, res) => {
  const cookie_token={ name:"yash" }
   res.cookie("jwt_yash31", cookie_token, { 
        expires: new Date(Date.now() + 864000000)});
        console.log(req.cookies)
  res.send("Hi,the API is working.");
});
app.get("/getcookie",(req,res)=>{
  res.send(req.cookies)
})
// routers -------------------

app.use("/", registerRouter);
app.use("/", loginRouter);
app.use("/all/", getAll);
app.use("/",addBeds);
app.use("/",availableBeds);
app.use("/bed",bookingBed);
app.use("/",newsLatter);


/// https://sih-23.herokuapp.com/ 
const port =process.env.PORT || 8000;
app.listen(port,()=>{
    console.log(`server is runnig on port : ${port}`);
})
