const Topics = require('../models').Topics;
const Question = require('../models').Questions;

const topicservice = require("../services/topic");

function getAllTopics(req, res) {
  topicservice.getTopics().then(data => res.send(data));
}



function getQuestions(req, res){
    topicservice.generateQuiz(
        {attributes: ['question', 'correct_answer', 'wrong_answer', 'topics_id', 'q_author'],where:{topics_id: req.params.id}, include:[{model: Topics, attributes: ['title']}]}

    )
    .then(data => res.send(data));
};



function addQuestion(req, res) {
  topicservice
    .createQuestion({
      question: req.body.question,
      correct_answer: req.body.correct_answer,
      wrong_answer: req.body.wrong_answer,
      topics_id: req.body.topics_id,
      q_author: req.body.q_author
    })
    .then(data => res.send(data));
}
module.exports = {
  getQuestions,
  getAllTopics,
  addQuestion
};
