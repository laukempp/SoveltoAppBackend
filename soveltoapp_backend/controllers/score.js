const Scores = require("../models").Scores;
const scoreservice = require("../services/score");
const Questions = require("../models").Questions;

function getScores(req, res) {
  scoreservice
    .getScore({
      attributes: ["id", "question", "correct_answer", "wrong_answer"],
      include: [{ model: Scores, Questions, where: { id: 1 } }]
      // where: { id: question_ids }
      // include: [{ model: Scores, where: { question_ids: id } }]
      // include: [{ model: Scores, attributes: ["nickname"] }]
    })
    .then(data => res.send(data));
}

// function getQuestions(req, res){
//   topicservice.generateQuiz(
//       {limit: req.body.number, attributes: ['id', 'question', 'correct_answer', 'wrong_answer', 'topics_id', 'q_author'],where:{topics_id: req.body.topics_id}, include:[{model: Topics, attributes: ['title']}]})
//   .then(data => res.send(data));
// };

// select distinct question, questions.id, correct_answer, wrong_answer from questions join scores on( questions.id = any(question_ids));

function getIndividualScore(req, res) {
  topicservice
    .getScore({ where: { nickname: req.body.nickname } })
    .then(data => res.send(data));
}

function addScores(req, res) {
  scoreservice
    .createScore({
      nickname: req.body.nickname,
      score: req.body.score
    })
    .then(data => res.send(data));
}

module.exports = {
  getScores,
  getIndividualScore,
  addScores
};
