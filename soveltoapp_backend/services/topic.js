const Topics = require("../models").Topics;
const Question = require("../models").Questions;
const Quiz = require("../models").Quiz;
const Temporaryquestion = require("../models").Temporaryquestions;

const createQuestion = async question =>
  await Question.create(question)
    .then(data => {
      return Question.findAll({
        attributes: ["id"],
        where: { q_author: question.q_author },
        order: [["createdAt", "DESC"]],
        limit: 1
      }).then(question => {
        return question[0].dataValues;
      });
    })
    .then(data => {
      return data;
    });

// Tämä luotu alunperin väliaikaisen kysymyksen luontiin
// const createTemporaryQuestion = async question =>
//   await Temporaryquestion.create(question).then(data => {
//     return Temporaryquestion.findAll({
//       attributes: ["id"],
//       where: { q_author: question.q_author },
//       order: [["createdAt", "DESC"]],
//       limit: 1
//     }).then(question => {
//       return question[0].dataValues;
//     });
//   });

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
  // createTemporaryQuestion,
  getTopics,
  getStudentQuestions,
  createQuiz,
  getQuestions
};
