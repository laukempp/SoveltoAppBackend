const Topics = require('../models').Topics;
const topicservice = require("../services/topic");

function getAllTopics(req, res) {
  topicservice.getTopics().then(data => res.send(data));
}

function getQuestions(req, res){
    topicservice.generateQuiz(
        {order: sequelize.random(), limit: req.body.number, attributes: ['id', 'question', 'correct_answer', 'wrong_answer', 'topics_id', 'q_author'],where:{topics_id: req.body.topics_id}, include:[{model: Topics, attributes: ['title']}]})
    .then(data => res.send(data));
};

function addQuestion(req, res) {
    console.log(req.body.wrong_answer)
  topicservice.createQuestion({
      question: req.body.question,
      correct_answer: req.body.correct_answer,
      wrong_answer: req.body.wrong_answer,
      topics_id: req.body.topics_id,
      q_author: req.body.q_author
    })
    .then(data => res.send(data));
}

function getStudentQuestions(req, res) {
    topicservice.getStudentQuestions({ where: { id: req.body.idArray} })
    .then(data => res.send(data))
}

module.exports = {
  getQuestions,
  getAllTopics,
  addQuestion,
  getStudentQuestions
};
