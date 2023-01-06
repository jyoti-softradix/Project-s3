module.exports = (sequelize, Sequelize) => {
    const posts = sequelize.define(
      "Posts",
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
        posts: {
          type: Sequelize.STRING,
          autoNull: true,
        },
        description: {
          type: Sequelize.STRING,
          autoNull: true,
        }
      })
      return posts;
    }