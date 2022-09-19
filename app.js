require("dotenv").config();
const express = require("express")
const cookieParser = require("cookie-parser");
const registerRouter = require("./routers/register");
const loginRouter = require("./routers/login");
const all = require("./routers/getall")
const addBads = require("./routers/addbads");
const availableBds = require("./routers/availablebads");
const bookingBad = require("./routers/bookingbad")
const newsLatter = require("./newslatter");


require("./database/database");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  res.send("Hi,the API is working.");
});

//Middlewares
app.use(express.json());
app.use(cookieParser());

// routers -------------------

app.use("/", registerRouter);
app.use("/", loginRouter);
app.use("/all/", all);
app.use("/",addBads);
app.use("/",availableBds);
app.use("/bad",bookingBad);
app.use("/",newsLatter);


/// https://sih-23.herokuapp.com/ 
const port =process.env.PORT || 8000;
app.listen(port,()=>{
    console.log(`server is runnig on port : ${port}`);
})
