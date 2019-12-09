CREATE DATABASE quizbase;

\c quizbase;
CREATE TABLE topics(
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
posttime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE questions(
    id SERIAL PRIMARY KEY,
    question text NOT NULL,
    correct_answer text,
    wrong_answer text ARRAY[3],
    topics_id int REFERENCES topics(id),
    q_author varchar(255),
    q_posttime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



INSERT INTO topics(title, posttime) VALUES('tämähän on helppoa', DEFAULT);
INSERT INTO topics(title, posttime) VALUES('tämähän on helppoa2', DEFAULT);
INSERT INTO topics(title, posttime) VALUES('tämähän on helppoa3', DEFAULT);
INSERT INTO topics(title, posttime) VALUES('tämähän on helppoa4', DEFAULT);
INSERT INTO topics(title, posttime) VALUES('tämähän on helppoa5', DEFAULT);
INSERT INTO topics(title, posttime) VALUES('tämähän on helppoa6', DEFAULT);

 INSERT INTO questions(topics_id, question, correct_answer, wrong_answer, q_author, q_posttime) VALUES (1, 'onko tämä helppoa?', 'ei', '{{"joo on helppoa", "ehkä on helppoa", "en tiedä"}}', 'Tommi', DEFAULT);
