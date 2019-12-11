var express = require('express');
var router = express.Router();
const authController = require('../controllers/auth');

/* GET users listing. 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/

module.exports.set = app => {
    app.post('/login', authController.login);
    app.post('/register', authController.register);
}

/*.exports = router;*/
