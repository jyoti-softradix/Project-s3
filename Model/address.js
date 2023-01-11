module.exports = (sequelize, Sequelize) => {
    const address = sequelize.define(
      "addresses",
      {
        id: {
          type: Sequelize.INTEGER,
        autoIncrement: true,
        autoNull: false,
        primaryKey: true,
        },
        user_id: {
            type: Sequelize.INTEGER,
            autoNull: false,
            foreignKey: true,
        },
        address:{
          type: Sequelize.STRING,
          autoNull: true,
        },
        city: {
          type: Sequelize.STRING,
          autoNull: true,
        },
        state: {
          type: Sequelize.STRING,
          autoNull: true,
        }
      })
      return address;
    }