const Topics = require('../models').Topics;
const Question = require('../models').Questions;

/* const generateQuiz = () => Topics.findAll(); */

const createQuestion = question => Question.create(question);

/* const generateQuiz = () => Question.findAll({where: {topics_id: 3}, include: [{model: Topics}]}); */

const generateQuiz = () => Question.findAll({attributes: ['question', 'correct_answer', 'wrong_answer', 'topics_id', 'q_author'],where:{topics_id: 3}, include:[{model: Topics, attributes: ['title']}]})
.then(question => {
    return question
})
module.exports = {generateQuiz, createQuestion}