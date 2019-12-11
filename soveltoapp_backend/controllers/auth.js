const config =  require('../config/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authService = require('../services/auth');
const userService = require('../services/user');
function login(req, res){
     return authService.authenticate(req.body)
     .then(token => {
          res.send({
               success: true,
               data: { token }
          });
     })
     .catch(err => {
          res.send({
               success: false,
               message: err.message //not the best error handling.
               //for better error handling visit github repository, link provided below
          });
     })
};
function register(req, res){
     var login = req.body.login;
     return userService.getUserByLogin(req.body.login || '')
     .then(exists => {
          if (exists){
               return res.send({
                   success: false,
                   message: 'Registration failed. User with this email already registered.'
               });
          }
          var user = {
               login: req.body.login,
               password: bcrypt.hashSync(req.body.password, config.saltRounds)
           }
          return userService.addUser(user)
          .then(() => res.send({success: true}));
     });
};

function logout(req, res) {
    return authService.authenticate(req.body)
     .then(token => {
          res.send({
               success: true,
               data: { token },
               tiedot: req.body

          });
     })
     .catch(err => {
          res.send({
               success: false,
               message: err.message //not the best error handling.
               //for better error handling visit github repository, link provided below
          });
     })

}
module.exports = {
    login,
    register,
    logout
}