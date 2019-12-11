const sequelize = require('../db/db');
const Users = require('../models').User;
const addUser = user => Users.create(user);
const getUserByLogin = login => Users.findOne({where: {login}});
module.exports = {
    addUser,
    getUserByLogin
}