var express = require("express");
var router = express.Router();
const topicController = require("../controllers/topic");
const authMiddleware = require("../middleware/auth");
const scoreController = require("../controllers/score");

var io = require("socket.io")();
/* GET home page. */
router
<<<<<<< HEAD
  .get("/api/topics/", topicController.getAllTopics)
  .post("/api/topics/", topicController.getQuestions)
  .post("/api/topics/quiz", topicController.getStudentQuestions)
  .post("/api/topics/question", topicController.addQuestion)
  .get("/api/scores", scoreController.getScores)

  //   .get("/api/scores/:nickname", scoreController.getIndividualScore);
  .post("/api/scores", scoreController.addScores);
=======
.get('/api/topics/', topicController.getAllTopics)
.post('/api/topics/', topicController.getQuestions)
.post('/api/topics/quiz', topicController.getStudentQuestions)
.post('/api/topics/question', authMiddleware.checkAuth, topicController.addQuestion)
.get("/api/scores", scoreController.getScores)
.get("/api/scores/:nickname", scoreController.getIndividualScore)
.post("/api/scores", scoreController.addScores);

>>>>>>> df233adb653664308fe724a8b205683629dd40de

io.on("connection", socket => {
  console.log("connection toimii");
  var quizUrl = `/student/quiz/`;

  socket.on("eventClick", () => {
    console.log("eventclick console logi");
    socket.broadcast.emit("redirect", quizUrl);
  });
  socket.on("eventMessage", eventBoolean => {
    console.log("message serverillä, lähetetään eteenpäin");
    socket.broadcast.emit("eventMessageStudent", eventBoolean);
  });

  socket.on("disconnect", client =>
    console.log("disconnected, reload to reconnect")
  );
});
<<<<<<< HEAD
=======

>>>>>>> df233adb653664308fe724a8b205683629dd40de
io.listen(5001);
module.exports = router;
/* console.log('Asiakas lähetti:', viesti) */
