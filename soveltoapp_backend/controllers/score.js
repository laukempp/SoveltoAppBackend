const scoreservice = require("../services/score");

function getScores(req, res) {
  scoreservice
    .getScore()
    .then(data => res.send(data));
}

function getOneStudent(req, res) {
  scoreservice.
  getOneForStudent({attributes: ["question_ids", "user_answer"], where: {nickname: req.body.nickname}})
  .then(data => res.json(data))
}

function getIndividualScore(req, res) {
  topicservice
    .getScore({ where: { nickname: req.body.nickname } })
    .then(data => res.send(data));
}

function addScores(req, res) {
  console.log(req.body)
  scoreservice
    .createScore({
      nickname: req.body.nickname,
      question_ids: req.body.question_ids,
      user_answer: req.body.user_answer
    })
    .then(data => res.send(data));
}

module.exports = {
  getScores,
  getIndividualScore,
  addScores,
  getOneStudent
};
