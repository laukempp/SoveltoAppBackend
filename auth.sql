CREATE DATABASE userbase;

\c userbase

CREATE TABLE users(
id SERIAL PRIMARY KEY,
login VARCHAR(255) NOT NULL,
password VARCHAR(255) NOT NULL,
"createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
"updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE topics(
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
posttime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
"createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
"updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions(
    id SERIAL PRIMARY KEY,
    question text NOT NULL,
    correct_answer text,
    wrong_answer text ARRAY[3],
    topics_id int REFERENCES topics(id),
    q_author varchar(255),
    q_posttime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO topics(title, posttime) VALUES('React', DEFAULT);
INSERT INTO topics(title, posttime) VALUES('Angular', DEFAULT);
INSERT INTO topics(title, posttime) VALUES('CSS', DEFAULT);
INSERT INTO topics(title, posttime) VALUES('HTML', DEFAULT);
INSERT INTO topics(title, posttime) VALUES('AWS', DEFAULT);
INSERT INTO topics(title, posttime) VALUES('SQL', DEFAULT);


 INSERT INTO questions(topics_id, question, correct_answer, wrong_answer, q_author, q_posttime) VALUES (1, 'Is this easy', 'no', '{{"yes", "kind of", "not sure"}}', 'Tommi', DEFAULT);

 INSERT INTO questions(topics_id, question, correct_answer, wrong_answer, q_author, q_posttime) VALUES (1, 'onko tämä helppoa?', 'ei', '{"joo on helppoa", "ehkä on helppoa", "en tiedä"}', 'Tommi', DEFAULT);

 INSERT INTO questions(topics_id, question, correct_answer, wrong_answer, q_author, q_posttime) VALUES (1, 'Who is a good boy?', 'The dog is', '{"Not me", "Possibly me", "Jesus Christ Superstar"}', 'Tommi', DEFAULT);

 INSERT INTO questions(topics_id, question, correct_answer, wrong_answer, q_author, q_posttime) VALUES (1, 'How big is the world?', 'Yambalayaa!', '{"Mambo number 5", "Scaramouche, scaramouche!", "Nothing matters to meeeeeee"}', 'Tommi', DEFAULT);

CREATE TABLE quiz(
    id SERIAL PRIMARY KEY,
    title text NOT NULL,
    question text ARRAY[],
    correct text ARRAY[],
    answers text ARRAY[],
    quiz_posttime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

