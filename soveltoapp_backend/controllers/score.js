const scoreservice = require("../services/score");

const errorMessage = [];

//Haetaan kaikki tulokset. Tässä määritellään haettavat atribuutit, kuinka monta riviä haetaan taulusta ja annetaan hakurajaus, joka on tässä kohtaa quizin ID
function getAllScores(req, res) {
  scoreservice
    .getAllTheScores({
      attributes: ["quiz_badge"],
      limit: 1,
      where: { quiz_author: req.body.teacher_badge },
      order: [["createdAt", "DESC"]]
    })
    .then(data => res.send(data))
    .catch(err => {
      res.send(errorMessage);
    });
}

//Haetaan yhden oppilaan tulokset - haussa käytetään opiskelijan vastaukseen liitettya tagia, joka on uniikki (frontti luo joka kerta uuden oman ja säilöö sitä sessionstoragessa)
function getOneStudent(req, res) {
  scoreservice
    .getOneForStudent({
      attributes: ["nickname", "question_ids", "user_answer"],
      where: {
        result_tag: req.body.result_tag,
        quiz_badge: req.body.quiz_badge
      }
    })
    .then(data => res.json(data))
    .catch(err => {
      res.send(errorMessage);
    });
}

//Lisätään tulokset-tauluun uusi tulosrivi
function addScores(req, res) {
  return scoreservice
    .verifyStudentScore(req.body || "")
    .then(exists => {
      if (exists[0]) {
        return res.send({
          success: false,
          message: "Tulos tälle tentille jo tallennettu"
        });
      }

      return scoreservice
        .createScore({
          nickname: req.body.nickname,
          question_ids: req.body.question_ids,
          user_answer: req.body.user_answer,
          result_tag: req.body.result_tag,
          quiz_badge: req.body.quiz_badge
        })
        .then(data => res.send(data));
    })
    .catch(err => {
      res.send({
        success: false,
        message: err.message
      });
    });
}

module.exports = {
  addScores,
  getOneStudent,
  getAllScores
};
