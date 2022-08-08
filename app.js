require("dotenv").config();
const express = require("express")
const cookieParser = require("cookie-parser");
const register_router = require("./routers/register");
const login_router = require("./routers/login");
const all = require("./routers/getall")
const addBads = require("./routers/addbads");
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

app.use("/", register_router);
app.use("/", login_router);
app.use("/all/", all);
app.use("/",addBads);

const port =process.env.PORT || 8000;
app.listen(port,()=>{
    console.log(`server is runnig on port : ${port}`);
})
