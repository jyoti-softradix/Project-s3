const express = require("express");
const bodyParser = require("body-parser");
const userController = require("./userController");
const s3Controller = require("../../common/s3");
const { validateJWTToken } = require("../../common/middelware");
const router = express.Router();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const multer = require("multer");
const path = require('path');
const upload =  multer({ dest: path.join(`${__dirname}/upload_files`) });

router.post("/signup", (req, res) => {
  userController.signup(req, res);
});

router.post("/login", (req, res) => {
  userController.login(req, res);
});

router.put("/forgotPass", (req, res) => {
  userController.forgotPassword(req, res);
});
router.post("/reset-password/:id/:token", (req, res) => {
  userController.resetPassword(req, res);
});
router.put("/editProfile", validateJWTToken, (req, res) => {
  userController.updateProfile(req, res);
});
router.put("/editPass", validateJWTToken, (req, res) => {
  userController.updatePassword(req, res);
});
router.post("/upload", upload.array('posts', 5), (req, res) =>{
  s3Controller.uploadFiles(req,res)
});

router.put("/logout", validateJWTToken, (req, res) => {
  userController.logout(req, res);
});
// router.post("/location", (req, res) => {
//   userController.getLocation(req, res);
// });
module.exports = router;
