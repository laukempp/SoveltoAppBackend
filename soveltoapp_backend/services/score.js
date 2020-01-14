const Scores = require("../models").Scores;
const Questions = require("../models").Questions;

const createScore = score => Score.create(score);

const getScore = results =>
  Questions.findAll(results).then(score => {
    return score;
  });

module.exports = { createScore, getScore };
