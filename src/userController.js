const db = require("../Model/db");
const randomstring = require("randomstring");
const services = require("./services");
const sendImBlue = require("../common/sendInBlue");
const {
  generateToken,
  comparePass,
  decodeToken
} = require("../common/middelware");
const Users = db.user;

// Signup user Api
async function signup(req, res) {
  const { body } = req;
  const details = body;
  try {
    const checkUser = await services.getUserByMail(details.email);
    if (checkUser) {
      return res.send("Email already exist");
    }
    const phone = await services.getUserByPhone(details.phone_number);
    if (phone) {
      return res.send("phone already exist");
    }

    if (!details.password) {
      details.password = randomstring.generate(7);
    }
    const userDetail = await Users.create(details);
    delete userDetail.password;

    const to = { email: details.email.toLowerCase() };
    const subject = "Signup confirmation mail";
    const htmlContent = `<html><h1> Name:${userDetail.first_name}</h1>
            <h2>Password is: ${details.password}</h2></html>`;
    await sendImBlue.sendinBlueMail(to, subject, htmlContent);
    console.log("sendTo", to, subject, htmlContent);
    const msg = "User signup successfully";
    res.status(201).json({status: 1, success: true, message: msg, data: userDetail });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
}

// Login user Api
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await Users.findOne({
      where: { email: email},
    });
    if(!result){
      return res.send("User not found");
      }
    const userData = result.toJSON();
    const match = await comparePass(password, userData.password);
    if (!match) {
      res.status(401).json({
        success: false,
        message: "Wrong password",
      });
    }
    const token = await generateToken(userData);
    const output = {
      ...userData,
      token,
    };
    const msg = "login successfully";
    res.status(201).json({status: 1, success: true, message: msg, data: output });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
}

// Forgot password Api
async function forgotPassword(req, res) {
  try {
    const { body } = req;
    const details = body;
    const userMail = await Users.findOne({ where: { email: details.email } });
    if (!userMail) {
      res.send("User Not Found");
    }
    const {id, email, password, phone_number } = userMail;
    // let check = 1
    // req.check = check
    const token =await generateToken({
        id,
      email,
      password,
      phone_number
    });
    const forgotPasswordLink = `${process.env.BASE_URL}/reset_password/${token}`;
    const to = { email: details.email.toLowerCase() };
    const subject = "Forgot password link";
    const htmlContent = `<html><h1> Here is Your One time forgot password link</h1>
    <a href="${forgotPasswordLink}">link text</a></html>`;
    await sendImBlue.sendinBlueMail(to, subject, htmlContent);
    res
      .status(200)
      .json({
        status: 1,
        success: true,
        message: "Forgot password",
        data: forgotPasswordLink,
      });
  } catch (e) {
    console.log('errorr', e.message)
    res.status(500).send({ message: e.message });
  }
}

//  Reset password Api
async function resetPassword(req, res) {
  try {
    const { body, params } = req;
    const details = body;
    const decoded = await decodeToken(params.token);
  
    if(decoded==="jwt expired"){
      return res.send("Token expired")
    }
    const user = await services.getUserById(decoded.id);
    if(!user){
      return res.send('User not found')
    }
    
    if(user.password != decoded.password){
      return  res.send({msg:"please login again"})
    }

      await services.updateById({ password: details.password }, user.id);
    
    
   
    const data  = await services.getUserByMail(decoded.email)
    res
      .status(200)
      .json({status:1, success: true, message: "Password reset successfully", data: data });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
}

// Update-profile Api
async function updateProfile(req, res) {
  try {
    const { body } = req;
    const details = body;
    const userData = req.user;
    // if (
    //   details.email !== userData.email &&
    //   details.phone_number !== userData.phone_number
    // ) {
      const getUser = await services.getUserByMail(details.email);
      if (getUser) {
        return res.send("Email  exist");
      }
      const byPhone = await services.getUserByPhone(details.phone_number);
      if (byPhone) {
        return res.send("phone  exist");
      }
    // }
    /**Update profile */
    await services.updateById(details, userData.id);
    const data  = await services.getUserById(userData.id);
    if(!data){
      return res.send("User not found");
    }
    const userDetail = data.toJSON();
    const token = generateToken(userData);
    const output = {
      ...userDetail,
      token,
    };
    res
      .status(200)
      .json({
        status:1,
        success: true,
        message: "Profile updated successfully",
        data: output,
      });
    
  } catch (e) {
     res.status(500).send({ message: e.message });
  }
}

//Update password
async function updatePassword(req, res) {
  try {
    const { body, user } = req;
    const passwordMatch = await comparePass(body.old_password, user.password);
    if (!passwordMatch) {
      res.status(400).send({ message: "Incorrect password" });
    }
    if (body.old_password === body.new_password) {
      return res.send('New password comparison')
    }
    await services.updateById({ password: body.new_password }, user.id);
    const data = await services.getUserByMail(user.email);
    res
      .status(200)
      .json({
          status: 1,
        success: true,
        message: "Password updated successfully",
        data: data,
      });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
}
module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updateProfile,
  updatePassword,
};
