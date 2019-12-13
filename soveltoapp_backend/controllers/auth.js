const config = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authService = require("../services/auth");
const userService = require("../services/user");
function login(req, res) {
  return authService
    .authenticate(req.body)
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
    });
}

function register(req, res) {
  var login = req.body.login;
  var pass = req.body.password;
  const validName = login => {
    var re = /\S+@\S+\.\S+/;
    return re.test(login);
  };
  const validPassword = pass => {
    var reP = /^(?=.*\d).{8,}$/;
    return reP.test(pass);
  };
  var isValidLogin = validName(login);
  var isValidPassword = validPassword(pass);
  /* console.log(isValid) */
  return (
    userService
      .getUserByLogin(req.body.login || "")
      /* .then(testi123 => {
          if(invalidName) {
               return res.send({
                    success: false,
                    message: 'Registration failed. Use email to register.'
                });
          }
     }) */
      .then(exists => {
        if (!isValidLogin) {
          return res.send({
            success: false,
            message: "Registration failed. Use your email for registeration."
          });
        } else if (!isValidPassword) {
          return res.send({
            success: false,
            message:
              "Registration failed. Password is too short, use at least 8 characters and(or) a number is required"
          });
        } else if (exists) {
          return res.send({
            success: false,
            message:
              "Registration failed. User with this email already registered."
          });
        }

        /*  else if(!) */
        var user = {
          login: req.body.login,
          password: bcrypt.hashSync(req.body.password, config.saltRounds)
        };
        return userService
          .addUser(user)
          .then(() =>
            res.send({ success: true, message: "Registration successful" })
          );
      })
  );
}

function logout(req, res) {
  return authService
    .authenticate(req.body)
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
    });
}
module.exports = {
  login,
  register,
  logout
};
