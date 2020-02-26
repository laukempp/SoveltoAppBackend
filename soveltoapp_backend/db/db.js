const config = require('../config/config');
require('dotenv').config();
const Sequelize = require('sequelize');
var sequelize = new Sequelize('userbase', process.env.DB_USER, process.env.DB_PASS, config.sequelizeConfig);

var db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;
/*require('sequelize-values')(sequelize);*/
module.exports = db;