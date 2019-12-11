var express = require('express');
var router = express.Router();
const topicController = require('../controllers/topic')

/* GET home page. */
router
.get('/api/topics', topicController.getQuestions)
.post('/api/topics/question', topicController.addQuestion);



module.exports = router;
