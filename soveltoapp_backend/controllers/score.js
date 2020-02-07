const scoreservice = require("../services/score");

function getScores(req, res) {
  scoreservice.getScore().then(data => res.send(data));
}

function getAllScores(req, res) {
  scoreservice
    .getAllTheScores({
      attributes: ["quiz_badge"],
      limit: 1,
      where: { quiz_author: req.body.teacher_badge }, order: [["createdAt", "DESC"]]
    })
    .then(data => res.send(data));
}

function getOneStudent(req, res) {
  scoreservice
    .getOneForStudent({
      attributes: ["nickname", "question_ids", "user_answer"],
      where: {result_tag: req.body.result_tag, quiz_badge: req.body.quiz_badge}
    })
    .then(data => res.json(data));
}

function getIndividualScore(req, res) {
  topicservice
    .getScore({ where: { nickname: req.body.nickname } })
    .then(data => res.send(data));
}

function addScores(req, res) {
  console.log(req.body);
  scoreservice
    .createScore({
      nickname: req.body.nickname,
      question_ids: req.body.question_ids,
      user_answer: req.body.user_answer,
      result_tag: req.body.result_tag,
      quiz_badge: req.body.quiz_badge
    })
    .then(data => res.send(data));
}

module.exports = {
  getScores,
  getIndividualScore,
  addScores,
  getOneStudent,
  getAllScores
};
