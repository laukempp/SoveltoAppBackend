const Topics = require('../models').Topics;
const Question = require('../models').Questions;

const generateQuiz = () => Topics.findAll();

const createQuestion = question => Question.create(question);

module.exports = {generateQuiz, createQuestion}