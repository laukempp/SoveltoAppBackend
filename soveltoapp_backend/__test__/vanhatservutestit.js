/* const request = require("supertest");
const app = require("../app");

// Testataan topiceja:
test("/api/topics should return data (statuscode 200)", () => {
  return request(app)
    .get("/api/topics")
    .then(response => {
      expect(response.statusCode).toBe(200);
    });
});

//Testataan, että saadaan yksi topic
test("/api/topics/id should return topic with id 1", () => {
  const id = 1;
  return request(app)
    .get(`/api/topics/${id}`)
    .then(response => {
      expect(response.statusCode).toBe(200);
    });
});

//Testataan, että topicin title matchaa
test("api/topics/id title should match 'react'", () => {
  const id = 1;
  return request(app)
    .get(`/api/topics/`)
    .then(response => {
      expect(response.statusCode).toBe(403);
      expect(response.body.title).toMatch("react");
    });
});

//Tarkistetaan, että topicin id on numero
test("/api/topics/id should return 400 when id is not integer", () => {
  const id = "testi";
  return request(app)
    .get(`/api/topics/`)
    .then(response => {
      expect(response.statusCode).toBe(400);
    });
});

//Jos topicia ei ole olemassa, annetaan 404 virheilmoitus
test("/api/topics/blaablaa, palauttaa 404", () => {
  return request(app)
    .get("/api/topics/blaablaa")
    .then(response => {
      expect(response.statusCode).toBe(404);
    });
});

//Testataan, että voidaan luoda uusi topic
test("/api/topics should be able to make a post SC(201)", () => {
  return request(app)
    .post("/api/topics")
    .send({ title: "Testiotsikko" })
    .then(response => {
      expect(response.statusCode).toBe(201);
    });
});

//Ei voi luoda topicia ilman oikeuksia
test("/api/topics should be able to make a post SC(201)", () => {
  return request(app)
    .post("/api/topics")
    .send({ title: "Testiotsikko" })
    .then(response => {
      expect(response.statusCode).toBe(401);
    });
});

//Ei voi lisätä topicia, joka on jo olemassa
test("Adding a topic that already exists returns a 400 response", () => {
  const exampletopic = { title: "react" };
  return request(app)
    .post("/api/topics")
    .send(exampletopic)
    .then(response => {
      expect(response.statusCode).toBe(400);
    });
});

//Ei voi luoda topicia ilman titleä
test("throws an error if topic's title is missing", () => {
  const exampletopic = { title: "" || null || undefined };
  return request(app)
    .post("/api/topics")
    .send(exampletopic)
    .then(response => {
      expect(response.statusCode).toBe(400);
    });
});

//Testataan, että voidaan poistaa topic auth-tokenilla
test("/api/topics/:id should delete a topic", () => {
  const id = 4;
  return request(app)
    .delete(`/api/topics/${id}`)
    .then(response => {
      expect(response.statusCode).toBe(202);
    });
});

//Delete ei onnistu, jos ei ole admin-oikeuksia
test("/api/topics/:id should return 401 if not authorized", () => {
  const id = 4;
  return request(app)
    .delete(`/api/topics/${id}`)
    .then(response => {
      expect(response.statusCode).toBe(401);
    });
});

//Delete ei onnistu, jos topicia ei olemassa
test("throws an error if trying to delete a topic that doesn't exist", () => {
  const topicId = 7000;
  return request(app)
    .delete(`/api/topics/${topicId}`)
    .then(response => {
      expect(response.statusCode).toBe(400);
    });
});

//Testataan, että questions palauttaa jotain
test("/api/questions should return data (statuscode 200)", () => {
  return request(app)
    .get("/api/questions")
    .then(response => {
      expect(response.statusCode).toBe(200);
    });
});

//Saadaan yksittäisen topicin alta kaikki kysymykset
test("/api/topics/id/questions should return all questions under specific topic", () => {
  const id = 1;
  return request(app)
    .get(`/api/topics/${id}/questions`)
    .then(response => {
      expect(response.statusCode).toBe(200);
    });
});

//Kysymyksen haku olemattomalla id:llä palauttaa 404
test("api/topics/id/questions returns 404 when id is not found", () => {
  const topicId = 1;
  const questionId = 7000;
  return request(app)
    .get(`/api/topics/${topicId}/questions/${questionId}`)
    .then(response => {
      expect(response.statusCode).toBe(404);
    });
});

//Testataan, että kysymyksen id on numero
test("/api/topics/topicId/questions/questionId should return 400 when id is not integer", () => {
  const topicId = 1;
  const questionId = "testi";
  return request(app)
    .get(`/api/topics/${topicId}/questions/${questionId}`)
    .then(response => {
      expect(response.statusCode).toBe(400);
    });
});

//Testataan, että voidaan luoda uusi kysymys
test("/api/topics/topicId/questions/ should be able to make a post SC(201)", () => {
  const topicId = 1;
  return request(app)
    .post(`/api/topics/${topicId}/questions`)
    .send({ question: "Testikysymys" })
    .then(response => {
      expect(response.statusCode).toBe(201);
    });
});

//Ei voida luoda kysymystä ilman admin-oikeuksia
test("/api/topics/topicId/questions/ should be able to make a post SC(201)", () => {
  const topicId = 1;
  return request(app)
    .post(`/api/topics/${topicId}/questions`)
    .send({ question: "Testikysymys" })
    .then(response => {
      expect(response.statusCode).toBe(401);
    });
});

//Ei voida luoda kysymystä ilman kysymystekstiä
test("throws an error if question's question-field is empty", () => {
  const topicId = 1;
  const exampleQuestion = { question: "" || null || undefined };
  return request(app)
    .post(`/api/topics/${topicId}/questions`)
    .send(exampleQuestion)
    .then(response => {
      expect(response.statusCode).toBe(400);
    });
});

//Testataan, että voidaan poistaa kysymys auth-tokenilla
test("/api/topics/topicId/questions/questionId should delete a question", () => {
  const topicId = 4;
  const questionId = 1;
  return request(app)
    .delete(`/api/topics/${topicId}/questions/${questionId}`)
    .then(response => {
      expect(response.statusCode).toBe(202);
    });
});

//Ei mahdollista poistaa kysymystä ilman auth-tokenia
test("/api/topics/topicId/questions/questionId should return 401 if not authorized", () => {
  const topicId = 4;
  const questionId = 1;
  return request(app)
    .delete(`/api/topics/${topicId}/questions/${questionId}`)
    .then(response => {
      expect(response.statusCode).toBe(401);
    });
});
 */