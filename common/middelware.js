const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../Model/db");
const Users = db.user;
require("dotenv").config();

function generateToken(userData) {
  return jwt.sign(userData, process.env.TOKEN_SECRET, { expiresIn: "24hr" });
}


const extractToken = (authToken) => {
  if (authToken) {
    const split = authToken.split(" ");
    if (split.length > 1) {
      return split[1];
    }
    return authToken;
  }
  return authToken;
};

function decodeToken(authorization) {
  try {
    const token = extractToken(authorization);
    if (!token) return res.status(401).send('Access Denied !');
    const verified = jwt.verify(token,  process.env.TOKEN_SECRET);
    return verified;
  } catch (error) {
    return error.message;
  }
}

function comparePass(Password, hash) {
  try {
    return bcrypt.compare(Password, hash);
  } catch (err) {
    return false;
  }
}

//verify token
async function validateJWTToken(req, res, next) {
  try {
    const result = await decodeToken(req.headers.authorization);
    req.user = result;
    if (result === "jwt expired") {
     return res.send("token expired");
    }
    const user = await Users.findOne({
      where: { id: result.id },
      raw: true,
    });
    if (!user) {
      res.status(400).json({ message: "Unauthorized user" });
    }
    req.user = user;
    /** return user */
    next();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
module.exports = {
  generateToken,
  decodeToken,
  comparePass,
  validateJWTToken
};
