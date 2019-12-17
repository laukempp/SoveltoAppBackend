const Topics = require("../models").Topics;
const Question = require("../models").Questions;

const createQuestion = question => Question.create(question);

const getTopics = () =>
  Topics.findAll({ attributes: ["id", "title"] }).then(topic => {
    return topic;
  });

const generateQuiz = (object) =>
  Question.findAll(object).then(question => {
    return question;
  });

const getStudentQuestions = (idList) =>
  Question.findAll(idList).then(question => {
      return question
  });

module.exports = { generateQuiz, createQuestion, getTopics, getStudentQuestions };

