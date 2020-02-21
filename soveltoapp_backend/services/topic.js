const Topics = require("../models").Topics;
const Question = require("../models").Questions;
const Quiz = require("../models").Quiz;

//Luodaan kysymysrivi. Käytössä sequelizen create-funktio
const createQuestion = question => Question.create(question);

//Luodaan uusi quiz-rivi sequelizen create-funktiolla
const createQuiz = quiz => Quiz.create(quiz)

//Haetaan aiheet sequelizen findAll-funktiolla
const getTopics = () =>
  Topics.findAll({ attributes: ["id", "title"] }).then(topic => {
    return topic;
  });

//Haetaan kysymykset opettajalle quizin luomista varten - tarkemmat määritykset controllerin puolella
const generateQuiz = (object) =>
  Question.findAll(object).then(question => {
    return question;
  });

//Haetaan tenttikysymykset opiskelijalle. Ensin suoritetaan haku quizzes-tauluun, mistä haetaan tenttiID:n perusteella kysymysten id-numerot arrayna. Tätä arrayta käytetään hakemaan kysymykset questions-taulusta.
const getStudentQuestions = (object) =>
  Quiz.findAll(object)
  .then(result => Question.findAll({where: {id: result[0].dataValues.question_ids}})
    .then(question => {
      return {question, result}
  })
  .then(question => question));

module.exports = { generateQuiz, createQuestion, getTopics, getStudentQuestions, createQuiz };

