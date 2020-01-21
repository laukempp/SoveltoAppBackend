const Scores = require("../models").Scores;
const Questions = require("../models").Questions;

const createScore = score => Scores.create(score);

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

  const getOneForStudent = (object) => 
  Scores.findAll(object)
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

  const arrayForEach = (item, index, array) => {

  }

  const calculateScores = (array) => {
    let count = 0;
    let newArray =  array.map((item, index) => {
      let newArray = item.user_answer.map((item, index) => {
        count = index;
        return ({count : item})
      }) 
      return newArray  
  }) 
  return newArray;
}

  const getAllTheScores = (object) => 
  Scores.findAll(object)
  .then(score => 
    Questions.findAll({attributes: ["id", "question", "correct_answer", "wrong_answer"], where: {id: score[0].dataValues.question_ids}}) 
    .then(quizQuestions => {
    console.log(score[0].dataValues.user_answer)
    let returnScore = calculateScores(score)
    return {quizQuestions, returnScore}
  }))
  .then(data => {
    return data}
  );

module.exports = { createScore, getScore, getOneForStudent, getAllTheScores };
