const Topics = require("../models").Topics;
const Question = require("../models").Questions;
const Quiz = require("../models").Quiz;
// const Temporaryquestion = require("../models").Temporaryquestions;

//Luodaan uusi kysymys tietokantaan. Funktio myös suorittaa tietokantahaun luomisen jälkeen ja palauttaa viimeisimmän luodun kysymyksen id:n
const createQuestion = async question =>
  await Question.create(question)
    .then(data => {
      if (question.istemporary) {
        console.log("ylempi funktio");
        return Question.findAll({
          attributes: ["id"],
          where: { q_author: question.q_author, istemporary: "t" },
          order: [["createdAt", "DESC"]],
          limit: 1
        }).then(question => {
          return question[0].dataValues;
        });
      } else {
        console.log("alempi funktio");
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

//Haetaan aiheet sequelizen findAll-funktiolla
const getTopics = () =>
  Topics.findAll({ attributes: ["id", "title"] }).then(topic => {
    return topic;
  });

const getTags = () => {
  Question.findAll({attributes: ["q_tags"]}).then(tags => tags)
}

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
  )

const clearTemporaryQuizzes = object => {
  Quiz.destroy(object);
};

const clearTemporaryQuestions = object => {
  Question.destroy(object);
};

module.exports = {
  generateQuiz,
  createQuestion,
  getTags,
  // createTemporaryQuestion,
  getTopics,
  getStudentQuestions,
  createQuiz,
  clearTemporaryQuizzes,
  clearTemporaryQuestions
};
