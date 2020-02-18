const Topics = require("../models").Topics;
const Question = require("../models").Questions;
const Quiz = require("../models").Quiz;

const createQuestion = async question =>
  await Question.create(question)
    .then(data => {
      return Question.findAll({
        attributes: ["id"],
        where: { q_author: 17714 },
        order: [["createdAt", "DESC"]],
        limit: 1
      }).then(question => {
        return question[0].dataValues;
      });
    })
    .then(data => {
      return data;
    });

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

const getQuestions = object => {
  Question.findAll(object).then(question => {
    return question[0].dataValues;
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
