var express = require('express');
var router = express.Router();
const topicController = require('../controllers/topic')
const authMiddleware = require('../middleware/auth')

/* GET home page. */
router
.get('/api/topics/:id', authMiddleware.checkAuth, topicController.getQuestions)
.post('/api/topics/question', authMiddleware.checkAuth, topicController.addQuestion);



module.exports = router;
