const bcrypt = require("bcrypt");
const saltRounds = 10;
module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define(
    "users",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        autoNull: false,
        primaryKey: true,
      },
      first_name: {
        type: Sequelize.STRING,
        autoNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        autoNull: false,
      },
      phone_number: {
        type: Sequelize.STRING,
        autoNull: true,
      },
      email: {
        type: Sequelize.STRING,
        autoNull: true,
      },
      password: {
        type: Sequelize.STRING,
        autoNull: true,
        defaultValue: null,
      },
      profile: {
        type: Sequelize.STRING,
        autoNull: true,
      },
      status:{
        type: Sequelize.BOOLEAN,
        autoNull: true,
        defaultValue: 0,
      }
    },
    {
      paranoid: true, 
      hooks: {
        beforeCreate: async (user) => {
          if (user && user.email) {
            // eslint-disable-next-line no-param-reassign
            user.email = user.email.toLowerCase();
          }
          if (user && user.password) {
            user.password = await bcrypt.hash(user.password, saltRounds);
          }
        },
        beforeBulkUpdate: async (user) => {
          if (user && user.attributes && user.attributes.password) {
            // eslint-disable-next-line no-param-reassign
            user.attributes.password = await bcrypt.hash(
              user.attributes.password,
              saltRounds
            );
          }
          if (user && user.attributes && user.attributes.email) {
            // eslint-disable-next-line no-param-reassign
            user.attributes.email = user.attributes.email.toLowerCase();
          }
        },
      },
    }
  );
  return user;
};
