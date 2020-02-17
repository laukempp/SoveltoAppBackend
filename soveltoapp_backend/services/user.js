const sequelize = require('../db/db');
const Users = require('../models').User;

const addUser = user => Users.create(user);

const getUserByLogin = login => Users.findOne({where: {login}});

const verifyUser = teacher_badge => Users.findOne({where:{teacher_badge}});

module.exports = {
    addUser,
    getUserByLogin,
    verifyUser
}