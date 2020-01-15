const Scores = require("../models").Scores;
const Questions = require("../models").Questions;

const createScore = score => Scores.create(score);

const getScore = () => 
  Scores.findAll({
    attributes: ["question_ids"]
  })
  .then(score => 
    Questions.findAll({where: {id: score[0].dataValues.question_ids}}, console.log("tämä on score", score))
    .then(data => {
    console.log(data)
    
    return data
  }))
  .then(data => {
    console.log("data")
    return data
  });

module.exports = { createScore, getScore };
