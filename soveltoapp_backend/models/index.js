/*const Sequelize = require('sequelize');*/
const db = require('../db/db');
sequelize = db.sequelize;
Sequelize = db.Sequelize;

const User = sequelize.define('user', {
    login: Sequelize.STRING,
    password: Sequelize.STRING
});
const Topics = sequelize.define('topics', {
     title: Sequelize.STRING /*,
     date: {
         type: Sequelize.DATE,
         defaultValue: Sequelize.NOW
      },
     user_id: {
         type: Sequelize.INTEGER,
         references: {
              model: User,
              key: 'id'
          }
      }*/
 });

const Questions = sequelize.define('questions', {
    question: Sequelize.TEXT,
    correct_answer: Sequelize.TEXT,
    wrong_answer: Sequelize.ARRAY(Sequelize.TEXT),
    topics_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Topics,
            key: 'id'
        }
    },
    q_author: Sequelize.STRING
    })
Topics.hasMany(Questions, {foreignKey: 'topics_id'});
Questions.belongsTo(Topics, {foreignKey: 'topics_id'});
module.exports = {
     User,
     Topics,
     Questions
 }