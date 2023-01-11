require("dotenv").config();
const db = require("./Model/db");
const users = require("./src/user/index");
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');

// const { upload, uploadFileToAWS } = require("./common/s3");
const app = express();
app.use(bodyParser.json());

app.use("/", users);


app.get("/", (req, res) => {
  res.send("Server is running successfully");
});

app.listen(5000, () => {
  console.log("listening on *:5000");
});
