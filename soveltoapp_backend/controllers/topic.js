const Op = require("Sequelize").Op;
const Topics = require("../models").Topics;
const topicservice = require("../services/topic");
const scoreservice = require("../services/score");

const condition = object => {
  if (object.q_tags[0] && object.topics_id !== 0) {
    return {
      topics_id: object.topics_id,
      q_tags: { [Op.overlap]: object.q_tags }
    };
  } else if (object.q_tags[0]) {
    return { q_tags: { [Op.overlap]: object.q_tags } };
  } else return { topics_id: object.topics_id };
};

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
    .then(data => res.send(data))
    .catch(err => {
      res.send({
        success: false,
        message: err.message
      });
    });
}

//Haetaan kysymykset - mikäli opettaja on rajannut haettavien rivien määrää, tuloksena on vain se määrä. Oletuslimit on 1000. Tämä on opettajalle haettavat kysymykset tentin luomista varten.
function getQuestions(req, res) {
  console.log(req.body);
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
        topics_id: req.body.topics_id,
        q_tags: { [Op.overlap]: req.body.q_tags }
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
      if (exists[0]) {
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
        .then(data => res.send(data));
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

// Väliaikaisten quizien, kysymysten ja tulosten poistofunktio. Poistaa databasesta yli 12 tuntia vanhat "t" merkinnällä olevat rivit.
const clearTemporaries = () => {
  const now = new Date();
  console.log(now);
  now.setHours(now.getHours() - 12);
  console.log(now);
  topicservice.clearTemporary({
    where: { istemporary: "t", createdAt: { [Op.lte]: now } }
  });
  return;
};

module.exports = {
  getQuestions,
  getAllTopics,
  addQuestion,
  getAllTags,
  getStudentQuestions,
  addQuiz
  // clearTemporaries
};
