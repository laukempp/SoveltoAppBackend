const Score = require("../models").Scores;

const createScore = score => Score.create(score);

const getScore = () =>
  Score.findAll({ attributes: ["nickname", "score"] }).then(score => {
    return score;
  });

module.exports = { createScore, getScore };
