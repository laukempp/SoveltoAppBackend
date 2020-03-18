const Op = require("Sequelize").Op;
const Topics = require("../models").Topics;
const topicservice = require("../services/topic");
const scoreservice = require("../services/score");

//Hakuehto-olion muotoilu kysymysten etsimiselle. Funktio tarkistaa, mitä hakuehtoja käyttäjä on fronttipäässä valinnut ja sen mukaan koostaa hakuehto-olion, jolla kysymykset tietokannasta haetaan
const condition = object => {
  let searchInput = {};

  if (object.q_tags) {
    searchInput["q_tags"] = { [Op.overlap]: object.q_tags };
  }
  if (object.topics_id) {
    searchInput["topics_id"] = object.topics_id;
  }
  if (object.useBadge) {
    searchInput["q_author"] = parseInt(object.teacher_badge);
  }
  return searchInput;
};

//Järjestämisehto kysymysten haulle; jos käyttäjä hakee vain rajatun määrän kysymyksiä, kysymysten järjestys satunnaistetaan. Muuten kysymykset tulevat id-järjestyksessä
const orderCondition = object => {
  if (object.number < 1000) {
    return sequelize.random();
  }
  return [["id", "ASC"]];
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
      order: orderCondition(req.body),
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
      where: condition(req.body)
    })
    .then(data => {
      if (!req.body.q_tags && !req.body.topics_id) {
        return res.send({
          message:
            "Kysymyksiä ei löytynyt. Muistithan antaa aiheen tai tageja hakuehdoiksi?"
        });
      } else if (!data[0]) {
        return res.send({
          message:
            "Kysymyksiä ei löytynyt. Kokeile esimerkiksi käyttää vähemmän tageja."
        });
      }
      return res.send(data);
    })
    .catch(err => {
      res.send({
        success: false,
        message: err.message
      });
    });
}

//Lisätään kysymysrivi & uusi aihe, mikäli aihe on uusi
function addQuestion(req, res) {
  if (req.body.topics_id.__isNew__) {
    console.log(req.body);
    topicservice
      .createTopic({
        title: req.body.topics_id.label,
        istemporary: req.body.istemporary
      })
      .then(data => {
        topicservice
          .createQuestion({
            question: req.body.question,
            correct_answer: req.body.correct_answer,
            wrong_answer: req.body.wrong_answer,
            topics_id: data.id,
            q_tags: req.body.q_tags,
            q_author: req.body.q_author,
            istemporary: req.body.istemporary
          })
          .then(data => {
            res.send({ data, success: true });
          })
          .catch(err => {
            res.send({
              success: false,
              message: err.message
            });
          });
      });
  } else {
    topicservice
      .createQuestion({
        question: req.body.question,
        correct_answer: req.body.correct_answer,
        wrong_answer: req.body.wrong_answer,
        topics_id: req.body.topics_id.value,
        q_tags: req.body.q_tags,
        q_author: req.body.q_author,
        istemporary: req.body.istemporary
      })
      .then(data => {
        res.send({ data, success: true });
      })
      .catch(err => {
        res.send({
          success: false,
          message: err.message
        });
      });
  }
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
          attributes: ["question_ids", "title", "quiz_badge", "quiz_type"],
          where: {
            quiz_badge: req.body.quiz_badge,
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
      istemporary: req.body.istemporary,
      quiz_type: req.body.quiz_type
    })
    .then(data => res.send({ success: true, message: "Onnistui" }))
    .catch(err => {
      res.send({
        success: false,
        message: err.message
      });
    });
}

// Väliaikaisten quizien, kysymysten ja tulosten poistofunktio. Poistaa databasesta yli 12 tuntia vanhat "t" merkinnällä olevat rivit.
const clearTemporaries = () => {
  const now = new Date();
  now.setHours(now.getHours() - 12);
  topicservice.clearTemporary({
    where: { istemporary: "t", createdAt: { [Op.lte]: now } }
  });
  return;
};
setInterval(clearTemporaries, 43200000);

module.exports = {
  getQuestions,
  getAllTopics,
  addQuestion,
  getAllTags,
  getStudentQuestions,
  addQuiz
};
