const Scores = require("../models").Scores;
const scoreservice = require("../services/score");

function getScores(req, res) {
  scoreservice.getScore().then(data => res.send(data));
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
      score: req.body.score
    })
    .then(data => res.send(data));
}

module.exports = {
  getScores,
  getIndividualScore,
  addScores
};
