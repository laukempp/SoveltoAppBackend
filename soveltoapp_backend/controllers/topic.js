const topicservice = require('../services/topic');
const Topics = require('../models').Topics;
const Question = require('../models').Questions;

function getQuestions(req, res){
    topicservice.generateQuiz(
        {attributes: ['question', 'correct_answer', 'wrong_answer', 'topics_id', 'q_author'],where:{topics_id: req.params.id}, include:[{model: Topics, attributes: ['title']}]}

    )
    .then(data => res.send(data));
};
function getTopic(req, res){
    topicservice.getById(req.params.id)
    .then(data => res.send(data));
}
function addQuestion(req, res){
    topicservice.createQuestion({
        question: req.body.question,
        correct_answer: req.body.correct_answer,
        wrong_answer: req.body.wrong_answer,
        topics_id: 1,
        q_author: req.body.q_author
    })
    .then(data => res.send(data));
};
module.exports = {
    getQuestions,
    getTopic,
    addQuestion
}