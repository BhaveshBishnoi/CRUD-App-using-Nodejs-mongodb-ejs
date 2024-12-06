//imports
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 4000;
const userRoute = require("./routes/route");

//Router Prifix

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use("", userRoute);

// Middlewares Assign
app.use(
  session({
    secret: "MySecretKey",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");

//Server Running

app.listen(port, () => {
  console.log(`Server is live on http://localhost:${port}`);
});

//DB Connection

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("DB Connection Successfull");
  } catch (error) {
    console.log(error);
  }
};
connect();
