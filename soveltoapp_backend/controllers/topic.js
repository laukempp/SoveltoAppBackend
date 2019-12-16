const topicservice = require("../services/topic");
function getQuestions(req, res) {
  topicservice.generateQuiz().then(data => res.send(data));
}
function getAllTopics(req, res) {
  topicservice.getTopics().then(data => res.send(data));
}
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
