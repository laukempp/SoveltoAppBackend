const Topics = require("../models").Topics;
const Question = require("../models").Questions;
const Quiz = require("../models").Quiz;

const createQuestion = question => Question.create(question);

const createQuiz = quiz => Quiz.create(quiz);

const getTopics = () =>
  Topics.findAll({ attributes: ["id", "title"] }).then(topic => {
    return topic;
  });

const generateQuiz = object =>
  Question.findAll(object).then(question => {
    return question;
  });

const getStudentQuestions = object =>
  Quiz.findAll(object).then(result =>
    Question.findAll({ where: { id: result[0].dataValues.question_ids } })
      .then(question => {
        return { question, result };
      })
      .then(question => question)
  );

const getQuestions = () => {
  Question.findAll().then(question => {
    return question;
  });
};

module.exports = {
  generateQuiz,
  createQuestion,
  getTopics,
  getStudentQuestions,
  createQuiz,
  getQuestions
};
