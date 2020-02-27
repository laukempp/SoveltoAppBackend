const Scores = require("../models").Scores;
const Questions = require("../models").Questions;
const Quizzes = require("../models").Quiz;

//Apufunktiot tulosten laskemiseen

//Tiedot tulevat tietokannasta per vastaaja - mutta me haluamme lähettää ne fronttiin per kysymys. Tämä funktio muotoilee arrayn uudelleen niin, että saadaan uudeksi arrayksi [[vastaus, vastaus, vastaus], [vastaus, vastaus, vastaus]] -> kokonaisarrayn pituus riippuu kysymysten määrästä ja ala-arrayden pituus vastaajien määrästä. Esimerkkiarrayssa on siis kaksi kysymystä ja kolme vastaajaa.
const modifyScoreArray = array => {
  let fullArray = [];

  let simpleArray = array.map(item => ({ answer: item.user_answer }));

  for (let i = 0; i < simpleArray[0].answer.length; i++) {
    fullArray.push(simpleArray.map(item => item.answer[i]));
  }
  return fullArray;
};

//Tämä array laskee tulokset. Sinne syötetään siis kysymystaulusta otettu array, jossa on merkittynä oikeat vastaukset ja yllä muotoiltu vastaus-array. Funktio laskee, kuinka monta kertaa tietty vastaus on valittu ja työntää tulokset joka for-loopilla omaan pieneen arrayihin. Näin saadaan jokaiselle kysymykselle result-array, jossa on neljä oliota ja kussakin oliossa kerrotaan olion arvo (vastauksen teksti), kuinka monta kertaa kyseinen arvo löytyi yllämuotoillusta vastausarraysta ja onko se oikea vai väärä vastaus. Lisäksi lopussa palautetaan myös itse kysymyksen teksti ja tieto siitä, kuinka monta vastaajaa on tentissä - tämä määritellään alkuperäisen scoretaulusta haetun arrayn perusteella.
const calculateScore = (arr1, arr2, arr3) => {
  let results = [];
  let resultArray = arr1.map(item =>
    item.wrong_answer.concat(item.correct_answer)
  );

  for (let i = 0; i < resultArray.length; i++) {
    let helpArray = [];
    for (let e = 0; e < resultArray[i].length; e++) {
      let result = arr2[i].filter(p => p === resultArray[i][e]).length;
      let correct = arr1[i].correct_answer === resultArray[i][e] ? true : false;

      helpArray.push({
        value: resultArray[i][e],
        count: result,
        isCorrect: correct
      });
    }
    results.push({
      id: arr1[i].id,
      question: arr1[i].question,
      results: helpArray,
      respondents: arr3.length
    });
  }
  return results;
};

//Tietokantafunktiot

//Luodaan tulos
const createScore = score => Scores.create(score);

//Haetaan yhden oppilaan vastausdata. Käytetään samoja ylläolevia apufunktioita kuin mitä käytetään koko vastausdatasetin muokkaukseen.
const getOneForStudent = object =>
  Scores.findAll(object)
    .then(score =>
      Questions.findAll({
        attributes: ["id", "question", "correct_answer", "wrong_answer"],
        where: { id: score[0].dataValues.question_ids }
      }).then(quizQuestions => {
        console.log(score[0].dataValues.question_ids);
        console.log(modifyScoreArray(score));
        return calculateScore(quizQuestions, modifyScoreArray(score), score);
      })
    )
    .then(data => data);

//Haetaan koko vastausdata opettajanäkymää varten
const getAllTheScores = object =>
  Quizzes.findAll(object).then(result =>
    Scores.findAll({
      attributes: ["question_ids", "user_answer"],
      where: { quiz_badge: result[0].dataValues.quiz_badge }
    })
      .then(scoreData =>
        Questions.findAll({
          attributes: ["id", "question", "correct_answer", "wrong_answer"],
          where: { id: scoreData[0].dataValues.question_ids }
        }).then(quizQuestions =>
          calculateScore(quizQuestions, modifyScoreArray(scoreData), scoreData)
        )
      )
      .then(data => data)
  );

const verifyStudentScore = object =>
  Scores.findAll({
    where: {
      result_tag: object.result_tag,
      quiz_badge: object.quiz_badge || ""
    }
  });

module.exports = {
  createScore,
  getOneForStudent,
  getAllTheScores,
  verifyStudentScore
};
