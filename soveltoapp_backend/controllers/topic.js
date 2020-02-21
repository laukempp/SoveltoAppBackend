const Op = require('Sequelize').Op
const Topics = require("../models").Topics;
const topicservice = require("../services/topic");

/*let condition = (string) => {
  if (string.quiz_author) {
    return ({ attributes: ["question_ids", "title"], where: 
      {quiz_author: string.quiz_author}, order: [["createdAt", "DESC"]], limit: 1})
  } else if (string.quiz_badge) {
    return ({attributes: ["question_ids", "title"], where: {quiz_badge: string.quiz_badge}, order: [["createdAt", "DESC"]], limit: 1 })
  }
}*/

//Haetaan kaikki aiheet 
function getAllTopics(req, res) {
  topicservice.getTopics().then(data => res.send(data))
  .catch(err => {
    console.log("virheviesti: " + err.message)
    res.send({
      success: false,
      message: err.message
    });
  })
  .catch(err => {
    res.send({
      success: false,
      message: err.message
    });
  });
}

//Haetaan kysymykset - mikäli opettaja on rajannut haettavien rivien määrää, tuloksena on vain se määrä. Oletuslimit on 1000. Tämä on opettajalle haettavat kysymykset tentin luomista varten.
function getQuestions(req, res) {
  topicservice
    .generateQuiz({
      limit: req.body.number,
      attributes: [
        "id",
        "question",
        "correct_answer",
        "wrong_answer",
        "topics_id",
        "q_author"
      ],
      where: { topics_id: req.body.topics_id },
      include: [{ model: Topics, attributes: ["title"] }]
    })
    .then(data => res.send(data))
    .catch(err => {
      console.log("virheviesti: " + err.message)
      res.send({
        success: false,
        message: err.message
      });
    });
}

//Lisätään kysymysrivi
function addQuestion(req, res) {
  console.log(req.body.wrong_answer);
  topicservice
    .createQuestion({
      question: req.body.question,
      correct_answer: req.body.correct_answer,
      wrong_answer: req.body.wrong_answer,
      topics_id: req.body.topics_id,
      q_author: req.body.q_author
    })
    .then(data => res.send(data))
    .catch(err => {
      console.log("virheviesti: " + err.message)
      res.send({
        success: false,
        message: err.message
      });
    });
}

//Tässä haetaan kysymyksiä opiskelijan näkymään, mikä tehdään hieman pidemmän kaavan kautta kuin opettajanäkymässä
function getStudentQuestions(req, res) {
  console.log(req.body.quiz_author)
  topicservice
    .getStudentQuestions({attributes: ["question_ids", "title"], where: {quiz_badge: req.body.badge}, order: [["createdAt", "DESC"]], limit: 1 })
      .then(data => res.send(data))
      .catch(err => {
        console.log("virheviesti: " + err.message)
        res.send({
          success: false,
          message: err.message
        });
      });
}

function addQuiz(req, res) {
  topicservice
  .createQuiz({
    title: req.body.title,
    question_ids: req.body.question_ids,
    quiz_badge: req.body.quiz_badge,
    quiz_author: req.body.quiz_author
  })
  .then(data => res.send(data))
  .catch(err => {
    console.log("virheviesti: " + err.message)
    res.send({
      success: false,
      message: err.message
    });
  });
}

module.exports = {
  getQuestions,
  getAllTopics,
  addQuestion,
  getStudentQuestions,
  addQuiz
};
