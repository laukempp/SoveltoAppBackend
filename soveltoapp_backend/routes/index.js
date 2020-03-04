var express = require("express");
var router = express.Router();
const topicController = require("../controllers/topic");
const authMiddleware = require("../middleware/auth");

var io = require("socket.io")();

/* GET home page. */
router
  .get("/api/topics/", authMiddleware, topicController.getAllTopics)
  .post("/api/topics/", authMiddleware, topicController.getQuestions)
  .post("/api/topics/question", authMiddleware, topicController.addQuestion)
  .post("/api/topics/quiz", authMiddleware, topicController.addQuiz)
  .get("/api/topics/tags", authMiddleware, topicController.getAllTags)
  .post("/api/quiz", topicController.getStudentQuestions);
// .post("/logout", topicController.clearTemporaries);

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
    ev = 1;
    socket.broadcast.emit("renderScore", ev);
  });
  /*socket.on("disconnect", client =>
    //console.log("disconnected, reload to reconnect")
  );*/
});

io.listen(5001);
module.exports = router;
/* console.log('Asiakas lähetti:', viesti) */
