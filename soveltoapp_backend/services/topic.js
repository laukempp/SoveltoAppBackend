const Topics = require("../models").Topics;
const Question = require("../models").Questions;
const Quiz = require("../models").Quiz;
const Scores = require("../models").Scores;
const Op = require("Sequelize").Op;

//Tagien parsintafunktio
const modifyTags = array => {
  let uniqueTags = [];
  let idNro = 0;

  array.forEach(element => {
    element.dataValues.q_tags.forEach(item => {
      if (!uniqueTags.includes(item)) {
        uniqueTags.push(item);
      }
    });
  });

  let returnArray = uniqueTags.map(item => {
    idNro++;
    return { id: idNro, name: item };
  });
  console.log("uniqueTags", returnArray);
  return returnArray;
};

// Arrayn muodostusfunktio, jota hyödynnetään clearTemporary-funktiossa.
const modifyArray = array => {
  let quizBadges = [];

  array.forEach(element => {
    quizBadges.push(element.dataValues.quiz_badge);
  });
  return quizBadges;
};

//Luodaan uusi kysymys tietokantaan. Funktio myös suorittaa tietokantahaun luomisen jälkeen ja palauttaa viimeisimmän luodun kysymyksen id:n
const createQuestion = async question =>
  await Question.create(question)
    .then(data => {
      if (question.istemporary) {
        return Question.findAll({
          attributes: ["id"],
          where: { q_author: question.q_author, istemporary: "t" },
          order: [["createdAt", "DESC"]],
          limit: 1
        }).then(question => {
          return question[0].dataValues;
        });
      } else {
        return Question.findAll({
          attributes: ["id"],
          where: { q_author: question.q_author },
          order: [["createdAt", "DESC"]],
          limit: 1
        }).then(question => {
          return question[0].dataValues;
        });
      }
    })
    .then(data => {
      console.log(data);
      return data;
    });

//Luodaan uusi quiz tietokantaan
const createQuiz = quiz => Quiz.create(quiz);

const createTopic = topic => Topics.create(topic)

//Haetaan aiheet sequelizen findAll-funktiolla
const getTopics = () =>
  Topics.findAll({ attributes: ["id", "title"] }).then(topic => {
    return topic;
  });

const getTags = () =>
  Question.findAll({
    where: { q_tags: { [Op.ne]: null } },
    attributes: ["q_tags"]
  }).then(tags => modifyTags(tags));

//Haetaan kysymykset opettajalle quizin luomista varten - tarkemmat määritykset controllerin puolella
const generateQuiz = object =>
  Question.findAll(object).then(question => {
    return question;
  });

//Haetaan tenttikysymykset opiskelijalle. Ensin suoritetaan haku quizzes-tauluun, mistä haetaan tenttiID:n perusteella kysymysten id-numerot arrayna. Tätä arrayta käytetään hakemaan kysymykset questions-taulusta.
const getStudentQuestions = object =>
  Quiz.findAll(object).then(result =>
    Question.findAll({ where: { id: result[0].dataValues.question_ids } })
      .then(question => {
        return { question, result };
      })
      .then(question => question)
  );

// Toteutetaan väliaikaisten rivien poisto.
const clearTemporary = async object => {
  let scores = [];
  await Scores.findAll({ attributes: ["quiz_badge"] }).then(result => {
    scores = modifyArray(result);
  });
  await Question.destroy(object);
  await Quiz.findAll(object).then(result => {
    let temporaryQuizzes = modifyArray(result);

    for (var i = 0; i < temporaryQuizzes.length; i++) {
      for (var j = 0; j < scores.length; j++) {
        if (temporaryQuizzes[i] === scores[j]) {
          Scores.destroy({ where: { quiz_badge: scores[j] } });
        }
      }
    }
  });
  await Quiz.destroy(object);
};

module.exports = {
  generateQuiz,
  createQuestion,
  getTags,
  getTopics,
  getStudentQuestions,
  createQuiz,
  clearTemporary,
  createTopic
};
