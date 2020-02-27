const Op = require("Sequelize").Op;
const Topics = require("../models").Topics;
const topicservice = require("../services/topic");
const scoreservice = require("../services/score");

//Haetaan kaikki aiheet
function getAllTopics(req, res) {
  topicservice
    .getTopics()
    .then(data => res.send(data))
    .catch(err => {
      res.send({
        success: false,
        message: err.message
      });
    });
}

//Haetaan kaikki tagit
function getAllTags(req, res) {
  topicservice
    .getTags()
    .then(data => {
      console.log(data), res.send(data);
    })
    .catch(err => {
      res.send({
        success: false,
        message: err.message
      });
    });
}

//Haetaan kysymykset - mikäli opettaja on rajannut haettavien rivien määrää, tuloksena on vain se määrä. Oletuslimit on 1000. Tämä on opettajalle haettavat kysymykset tentin luomista varten.
function getQuestions(req, res) {
  topicservice
    .generateQuiz({
      limit: req.body.number,
      attributes: [
        "id",
        "question",
        "correct_answer",
        "wrong_answer",
        "topics_id",
        "q_tags",
        "q_author"
      ],
      where: {
        topics_id:
          req.body.topics_id /*, q_tags: {[Op.overlap]: req.body.q_tags}*/
      },
      include: [{ model: Topics, attributes: ["title"] }]
    })
    .then(data => res.send(data))
    .catch(err => {
      res.send({
        success: false,
        message: err.message
      });
    });
}

//Lisätään kysymysrivi
function addQuestion(req, res) {
  topicservice
    .createQuestion({
      question: req.body.question,
      correct_answer: req.body.correct_answer,
      wrong_answer: req.body.wrong_answer,
      topics_id: req.body.topics_id,
      q_tags: req.body.q_tags,
      q_author: req.body.q_author,
      istemporary: req.body.istemporary
    })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send({
        success: false,
        message: err.message
      });
    });
}

//Tässä haetaan kysymyksiä opiskelijan näkymään, mikä tehdään hieman pidemmän kaavan kautta kuin opettajanäkymässä. Tässä siis tarkistetaan ensin, onko oppilaan sessionID:lla ja quizin ID:lla jo tallennettu vastausrivi score-tauluun. Jos on, ei palauteta dataa, koska oppilas on jo kerran vastannut quiziin. Jos ei ole, palautetaan data, mikäli quiz on luotu alle 10 minuuttia sitten JA opettajanumero on oikein.
function getStudentQuestions(req, res) {
  return scoreservice
    .verifyStudentScore(req.body)
    .then(exists => {
      console.log(exists[0]);
      if (exists[0]) {
        console.log("moi");
        return res.send({
          success: false
        });
      }
      const now = new Date();
      now.setMinutes(now.getMinutes() - 10);

      return topicservice
        .getStudentQuestions({
          attributes: ["question_ids", "title", "quiz_badge"],
          where: {
            quiz_author: req.body.badge,
            quiz_posttime: { [Op.gte]: now.toISOString() }
          },
          order: [["createdAt", "DESC"]],
          limit: 1
        })
        .then(data => {
          console.log("täällä");
          res.send(data);
        });
    })
    .catch(err => {
      res.send({
        success: false,
        message: err.message
      });
    });
}

//Luodaan uusi quiz-olio ja lähetetään se tietokantaan tallennettavaksi
function addQuiz(req, res) {
  topicservice
    .createQuiz({
      title: req.body.title,
      question_ids: req.body.question_ids,
      quiz_badge: req.body.quiz_badge,
      quiz_author: req.body.quiz_author,
      istemporary: req.body.istemporary
    })
    .then(data => res.send(data))
    .catch(err => {
      console.log("virheviesti: " + err.message);
      res.send({
        success: false,
        message: err.message
      });
    });
}

// function getLatestQuestion(req, res) {
//   console.log("Ennen parseint" + req.body.badge);
//   // console.log("Parseintattu" + badge);
//   topicservice
//     .getQuestions({
//       attributes: ["id"],
//       where: { q_author: req.body.badge },
//       order: [["createdAt", "DESC"]],
//       limit: 1
//     })
//     .then(data => res.send(data))
//     .catch(err => {
//       console.log("virheviesti: " + err.message);
//       res.send({
//         success: false,
//         message: err.message
//       });
//     });
// }

function clearTemporaries(req) {
  console.log(req.body.q_author);
  topicservice.clearTemporaryQuizzes({
    where: { quiz_author: req.body.badge, istemporary: "t" }
  });
  topicservice.clearTemporaryQuestions({
    where: { q_author: req.body.badge, istemporary: "t" }
  });
}

module.exports = {
  getQuestions,
  getAllTopics,
  addQuestion,
  getAllTags,
  // addTemporaryQuestion,
  getStudentQuestions,
  addQuiz,
  // getLatestQuestion,
  clearTemporaries
};
