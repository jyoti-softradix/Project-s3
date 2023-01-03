require("dotenv").config();
const db = require("./Model/db");
const users = require("./src/index");
const express = require("express");
const bodyParser = require("body-parser");

// const { upload, uploadFileToAWS } = require("./common/s3");
const app = express();
app.use(bodyParser.json());

app.use("/", users);

// upload file to aws s3 bucket
// app.post("/upload", upload.single("profile"), async (req, res) => {
//   if (req.file) {
//     const data = await uploadFileToAWS(req.file.buffer);
//     res.send({success: true, msg: "Image uploaded successfully", data: data});
//   }
//   res.send({success: false, msg: "something wrong"});
// });

app.get("/", (req, res) => {
  res.send("Server is running successfully");
});

app.listen(5000, () => {
  console.log("listening on *:5000");
});
