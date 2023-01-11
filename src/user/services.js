// const sequelize = require('sequelize')
const db = require("../../Model/db");
const Users = db.user;
const Address = db.address;

module.exports = {
  async getUserByMail(email) {
    return Users.findOne({ where: { email: email}});
  },
  async getUserById(id) {
    return Users.findOne({ where: { id: id}});
  },
  async createUser(data, transaction){
    return Users.create(data,{ transaction },);
  },
  async addUserAddress(payload, transaction){
    return Address.create(payload,{ transaction },);
  },
  async getUserByPhone(phone_number) {
    return Users.findOne({ where: { phone_number: phone_number }});
  },
  async updateById(data, id, transaction) {
    return Users.update( data, { where: { id: id} }, { transaction });
  },
  async updateStatus(data, query){
    return Users.update( data, { where: query });
  }
};
