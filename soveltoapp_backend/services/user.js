const sequelize = require('../db/db');
const Users = require('../models').User;

//Lisätään käyttäjä tietokantaan
const addUser = user => Users.create(user);

//Etsitään käyttäjä tietokannasta loginin perusteella
const getUserByLogin = login => Users.findOne({where: {login}});

//Haetaan tietokannasta käyttäjä opettajatunnuksen perusteella
const verifyUser = teacher_badge => Users.findOne({where:{teacher_badge}});

module.exports = {
    addUser,
    getUserByLogin,
    verifyUser
}