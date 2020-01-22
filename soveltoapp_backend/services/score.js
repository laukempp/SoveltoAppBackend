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

  const calculateScores = (array) => {
    let fullArray = [];

    let simpleArray = array.map(item => {
      return {answer: item.user_answer}
    })

    for (let i = 0; i < simpleArray[0].answer.length; i++) {
      let tempArray = simpleArray.map(item => {
        return item.answer[i]
      })
      fullArray.push(tempArray)
    }

    /*for (let i = 0; i < array[0].user_answer.length; i++) {
      testi.push(array[j].user_answer[j])
      j++;

    }*/
    /*for (let i = 0; i < help[0].answer.length; i++) {
      console.log("Ulompi looppi: " + help[i])
      let thisArray = help.map((item, index) => {
        return help[i][index]
      })
      testi.push(thisArray)
    }

    for(let i = 0; i < )*/

    /*for (let e = 0; e < 2; e++) {
      testi[e] = [];
      for ( let i = 0; i < 3; i++) {
       
        testi[e][i] = help[e].answer[i];
        }
      }
      let vastaus = [];
      for (let j = 0; j < testi.length; j++) {
        vastaus.push(testi[j][0]) 
      }*/
    //array[0].user_answer[0]
    return fullArray
}

  const getAllTheScores = (object) => 
  Scores.findAll(object)
  .then(score => 
    Questions.findAll({attributes: ["id", "question", "correct_answer", "wrong_answer"], where: {id: score[0].dataValues.question_ids}}) 
    .then(quizQuestions => {
    console.log(score[0].dataValues.user_answer)
    let returnScore = calculateScores(score)
    let another = score[1].user_answer[0];
    return {quizQuestions, returnScore}
  }))
  .then(data => {
    return data}
  );

module.exports = { createScore, getScore, getOneForStudent, getAllTheScores };
