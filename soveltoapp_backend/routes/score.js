var express = require("express");
var router = express.Router();
const authMiddleware = require("../middleware/auth");
const scoreController = require("../controllers/score");

module.exports.set = app => {
    app.post("/api/scores", scoreController.addScores)
    app.post("/api/scores/student", scoreController.getOneStudent)
    app.post("/api/scores/all", scoreController.getAllScores);
    };