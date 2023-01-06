const express = require("express");
const bodyParser = require("body-parser");
const postController = require("./postController");
const { validateJWTToken } = require("../../common/middelware");
const router = express.Router();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

router.post("/posts", validateJWTToken, (req, res) => {
    postController.createPost(req, res);
});

router.get("/getOnePost", validateJWTToken, (req, res) => {
    postController.getPostById(req, res);
});

module.exports = router;