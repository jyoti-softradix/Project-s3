const db = require("../../Model/db");
const randomstring = require("randomstring");
const jwt = require('jsonwebtoken');
const services = require("./services");
const sendInBlue = require("../../common/sendInBlue");
const {
  generateToken,
  comparePass,
} = require("../../common/middelware");
const Users = db.user;
 const sequelize = db.sequelize;

// Signup user Api
async function signup(req, res) {
  const { body } = req;
  let transaction;
  try {
    const checkUser = await services.getUserByMail(body.email);
    if (checkUser) {
      return res.send("Email already exist");
    }
    const phone = await services.getUserByPhone(body.phone_number);
    if (phone) {
      return res.send("phone already exist");
    }
    transaction = await sequelize.transaction();
    if (!body.password) {
      body.password = randomstring.generate(7);
    }
    const userDetail = await services.createUser(body,transaction);
    delete userDetail.password;
    //sending mail
    const to = { email: body.email};
    const subject = "Signup confirmation mail";
    const htmlContent = `<html><h1> Name:${userDetail.first_name}</h1>
            <h2>Password is: ${body.password}</h2></html>`;
    await sendInBlue.sendinBlueMail(to, subject, htmlContent);
    console.log("sendTo", to, subject, htmlContent);
    await transaction.commit();
    res.status(201).json({status: 1, success: true, message: "User signup successfully", data: userDetail });
  } catch(e){
    if (transaction) {
      await transaction.rollback();
    }
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

    await  services.updateStatus({status: 1}, {email: userData.email})
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
    res.status(201).json({status: 1, success: true, message: "login successfully", data: output });
  } catch (e) {
    if (transaction) {
      await transaction.rollback();
    }
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
    const {id, email, phone_number } = userMail;
    // let check = 1
    // req.check = check
    const token =await jwt.sign({ 
        id,
      email,
      phone_number
    },
    userMail.password, { expiresIn: "24hr" });
    const forgotPasswordLink = `${process.env.BASE_URL}/reset_password/${userMail.id}/${token}`;
    const to = { email: details.email };
    const subject = "Forgot password link";
    const htmlContent = `<html><h1> Here is Your One time forgot password link</h1>
    <a href="${forgotPasswordLink}">link text</a></html>`;
    await sendInBlue.sendinBlueMail(to, subject, htmlContent);
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
   
    const user = await services.getUserById(params.id);
    if(!user){
      return res.send('User not found')
    }
    
    const decoded = await jwt.verify(params.token, user.password, function(err,decoded){
      if(err){
        return res.send({msg:"Invalid url"})
      }
      // else{
      //   req.decoded = decoded
      // }
    })
    console.log('1111', decoded)
      await services.updateById({ password: details.password }, user.id);
    
    const data  = await services.getUserByMail(user.email)
    res
      .status(200)
      .json({status:1, success: true, message: "Password reset successfully", data: data });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
}

// Update-profile Api
async function updateProfile(req, res) {
  const { body } = req;
  const userData = req.user;
  let transaction;
  try {
      const getUser = await services.getUserByMail(body.email);
      if (getUser) {
        return res.send("Email  exist");
      }
      const byPhone = await services.getUserByPhone(body.phone_number);
      if (byPhone) {
        return res.send("phone  exist");
      }
      transaction = await sequelize.transaction();
    /**Update profile */
    await services.updateById(body, userData.id, transaction);
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
    await transaction.commit(); 
    res
      .status(200)
      .json({
        status:1,
        success: true,
        message: "Profile updated successfully",
        data: output,
      });
    
  } catch (e) {
    if (transaction) {
      await transaction.rollback();
    }
     res.status(500).send({ message: e.message });
  }
}

//Update password
async function updatePassword(req, res) {
  const { body, user } = req;
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const passwordMatch = await comparePass(body.old_password, user.password);
    if (!passwordMatch) {
      res.status(400).send({ message: "Incorrect password" });
    }
    if (body.old_password === body.new_password) {
      return res.send('New password comparison')
    }
    await services.updateById({ password: body.new_password }, user.id, transaction);
    await transaction.commit();
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
    if(transaction){
     await transaction.rollback();
    }
    res.status(500).send({ message: e.message });
  }
}

//logout user
async function logout(req, res){
  try{
  const userData = req.user;
    await  services.updateStatus({status: 0}, {id: userData.id})
    const data  = await services.getUserById(userData.id);
    if(!data){
      return res.send('User not found')
    }
   res.status(200).json({
          status: 1,
        success: true,
        message: "Logout User successfully",
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
  logout,
};
