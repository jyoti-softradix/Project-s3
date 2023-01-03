const Sequelize = require("sequelize");
const sequelize = new Sequelize("demo_project", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// create table if not exists
db.sequelize.sync({ force: false });

db.user = require("./user")(sequelize, Sequelize);

//export db
module.exports = db;
