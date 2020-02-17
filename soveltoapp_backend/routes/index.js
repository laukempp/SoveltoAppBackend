var express = require("express");
var router = express.Router();
const topicController = require("../controllers/topic");
const authMiddleware = require("../middleware/auth");
const scoreController = require("../controllers/score");

var io = require("socket.io")();

/* GET home page. */
router
  .get("/api/topics/", authMiddleware, topicController.getAllTopics)
  .post("/api/topics/", authMiddleware, topicController.getQuestions)
  .post("/api/topics/question", authMiddleware, topicController.addQuestion)
  .post("/api/topics/quiz", authMiddleware, topicController.addQuiz)
  .post("/api/quiz", topicController.getStudentQuestions)
  .post("/api/question", topicController.getLatestQuestion);

io.on("connection", socket => {
  //console.log("connection toimii");
  var quizUrl = `/student/quiz/`;

  socket.on("eventClick", () => {
    console.log("eventclick console logi");
    socket.broadcast.emit("redirect", quizUrl);
  });
  socket.on("eventMessage", eventBoolean => {
    console.log("message serverillä, lähetetään eteenpäin");
    socket.broadcast.emit("eventMessageStudent", eventBoolean);
  });

  socket.on("submitClick", ev => {
    console.log("student has submitted quiz to db");

    socket.broadcast.emit("renderScore");
  });
  /*socket.on("disconnect", client =>
    //console.log("disconnected, reload to reconnect")
  );*/
});

io.listen(5001);
module.exports = router;
/* console.log('Asiakas lähetti:', viesti) */
