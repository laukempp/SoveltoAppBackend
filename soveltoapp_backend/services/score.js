const Scores = require("../models").Scores;
const Questions = require("../models").Questions;

const createScore = score => Score.create(score);

const getScore = () =>
  Scores.findAll({
    attributes: ["question_ids", "nickname", "user_answer"]
  })
  .then(score => 
    Questions.findAll({attributes: ["id", "question", "correct_answer", "wrong_answer"], where: {id: score[0].dataValues.question_ids}}) 
    .then(quizQuestions => {
    console.log(quizQuestions)
    return {quizQuestions, score}
  }))
  .then(data => {
    console.log(data)
    return data}
  );

module.exports = { createScore, getScore };
