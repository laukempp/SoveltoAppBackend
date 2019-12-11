const config = require('../config/config');
const Sequelize = require('sequelize');
var sequelize = new Sequelize('userbase', 'postgres', 'Sovelto1', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,

    pool: {
        max: 9,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

var db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;
/*require('sequelize-values')(sequelize);*/
module.exports = db;