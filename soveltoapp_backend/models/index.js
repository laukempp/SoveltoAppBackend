// Luodaan tietokannasta malli
const db = require("../db/db");
sequelize = db.sequelize;
Sequelize = db.Sequelize;

const User = sequelize.define("user", {
  login: Sequelize.STRING,
  password: Sequelize.STRING,
  teacher_badge: Sequelize.INTEGER
});

const Topics = sequelize.define("topics", {
  title: Sequelize.STRING
});

const Questions = sequelize.define("questions", {
  question: Sequelize.TEXT,
  istemporary: Sequelize.BOOLEAN,
  correct_answer: Sequelize.TEXT,
  wrong_answer: Sequelize.ARRAY(Sequelize.TEXT),
  topics_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Topics,
      key: "id"
    }
  },
  q_author: Sequelize.INTEGER
});
// Tämä luotu alunperin väliaikaisen kysymyksen luontiin
// const Temporaryquestions = sequelize.define("temporaryquestions", {
//   question: Sequelize.TEXT,
//   correct_answer: Sequelize.TEXT,
//   wrong_answer: Sequelize.ARRAY(Sequelize.TEXT),
//   topics_id: {
//     type: Sequelize.INTEGER,
//     references: {
//       model: Topics,
//       key: "id"
//     }
//   },
//   q_author: Sequelize.INTEGER
// });

const Quiz = sequelize.define("quizzes", {
  title: Sequelize.STRING,
  question_ids: Sequelize.ARRAY(Sequelize.INTEGER),
  quiz_badge: Sequelize.TEXT,
  quiz_author: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: "teacher_badge"
    }
  }
});

const Scores = sequelize.define("scores", {
  nickname: Sequelize.STRING,
  question_ids: Sequelize.ARRAY(Sequelize.INTEGER),
  user_answer: Sequelize.ARRAY(Sequelize.TEXT),
  quiz_badge: {
    type: Sequelize.TEXT,
    references: {
      model: Quiz,
      key: "quiz_badge"
    }
  },
  result_tag: Sequelize.INTEGER
});

Topics.hasMany(Questions, { foreignKey: "topics_id" });
Questions.belongsTo(Topics, { foreignKey: "topics_id" });
Questions.hasMany(Scores, { foreignKey: "question_ids" });
Scores.belongsTo(Questions, { foreignKey: "id" });
User.hasMany(Quiz, { foreignKey: "teacher_badge" });
Quiz.belongsTo(User, { foreignKey: "quiz_author" });
Quiz.hasMany(Scores, { foreignKey: "quiz_badge" });
Scores.belongsTo(Quiz, { foreignKey: "quiz_badge" });

module.exports = {
  User,
  Topics,
  Questions,
  // Temporaryquestions,
  Scores,
  Quiz
};
