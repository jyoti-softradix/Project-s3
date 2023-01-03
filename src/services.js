// const sequelize = require('sequelize')
const db = require("../Model/db");
const Users = db.user;

module.exports = {
  async getUserByMail(email) {
    console.log(email)
    return Users.findOne({ where: { email: email.toLowerCase() }});
  },
  async getUserById(id) {
    return Users.findOne({ where: { id: id}});
  },
  async getUserByPhone(phone_number) {
    return Users.findOne({ where: { phone_number: phone_number }});
  },
  async updateById(data, id) {
    return Users.update( data, { where: { id: id} });
  }
};
