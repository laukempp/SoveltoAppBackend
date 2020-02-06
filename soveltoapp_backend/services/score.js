const Scores = require("../models").Scores;
const Questions = require("../models").Questions;
const Quizzes = require("../models").Quiz;

//Apufunktiot tulosten laskemiseen

const modifyScoreArray = array => {
  let fullArray = [];

  let simpleArray = array.map(item => ({ answer: item.user_answer }));

  for (let i = 0; i < simpleArray[0].answer.length; i++) {
    fullArray.push(simpleArray.map(item => item.answer[i]));
  }
  return fullArray;
};

const calculateScore = (arr1, arr2) => {
  let results = [];
  let resultArray = arr1.map(item =>
    item.wrong_answer.concat(item.correct_answer)
  );

  for (let i = 0; i < resultArray.length; i++) {
    let helpArray = [];
    for (let e = 0; e < resultArray[i].length; e++) {
      let result = arr2[i].filter(p => p === resultArray[i][e]).length;
      let correct = arr1[i].correct_answer === resultArray[i][e] ? true : false;

      helpArray.push({
        value: resultArray[i][e],
        count: result,
        isCorrect: correct
      });
    }
    results.push({
      id: arr1[i].id,
      question: arr1[i].question,
      results: helpArray
    });
  }
  return results;
};

//Tietokantafunktiot
const createScore = score => Scores.create(score);

const getScore = () =>
  Scores.findAll({
    attributes: ["question_ids", "nickname", "user_answer"]
  })
    .then(score =>
      Questions.findAll({
        attributes: ["id", "question", "correct_answer", "wrong_answer"],
        where: { id: score[0].dataValues.question_ids }
      }).then(quizQuestions => {
        quizQuestions, score;
      })
    )
    .then(data => data);

const getOneForStudent = object =>
  Scores.findAll(object)
    .then(score =>
      Questions.findAll({
        attributes: ["id", "question", "correct_answer", "wrong_answer"],
        where: { id: score[0].dataValues.question_ids }
      }).then(quizQuestions =>
        calculateScore(quizQuestions, modifyScoreArray(score))
      )
    )
    .then(data => data);

const getAllTheScores = object =>
  Quizzes.findAll(object).then(result =>
    Scores.findAll({
      attributes: ["question_ids", "user_answer"],
      where: { quiz_badge: result[0].dataValues.quiz_badge }
    })
      .then(scoreData => 
        Questions.findAll({
          attributes: ["id", "question", "correct_answer", "wrong_answer"],
          where: { id: scoreData[0].dataValues.question_ids }
        }).then(quizQuestions =>
          calculateScore(quizQuestions, modifyScoreArray(scoreData))
        ))
      .then(data => data)
  );

/*Scores.findAll(object)
  .then(score => 
    Questions.findAll({attributes: ["id", "question", "correct_answer", "wrong_answer"], where: {id: score[0].dataValues.question_ids}}) 
    .then(quizQuestions => calculateScore(quizQuestions, modifyScoreArray(score))))
  .then(data =>  data);*/

module.exports = { createScore, getScore, getOneForStudent, getAllTheScores };
