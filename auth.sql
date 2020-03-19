CREATE DATABASE userbase;
\c userbase
-- Luodaan taulu rekisteröityneille käyttäjille
CREATE TABLE users(
id SERIAL PRIMARY KEY,
login VARCHAR(255) NOT NULL,
password VARCHAR(255) NOT NULL,
teacher_badge INT NOT NULL UNIQUE,
"createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
"updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Aihe-alue -taulu
CREATE TABLE topics(
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
isTemporary boolean,
posttime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
"createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
"updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Kysymystaulu (referenssi aihe-alueeseen)
CREATE TABLE questions(
    id SERIAL PRIMARY KEY,
    question text NOT NULL,
    isTemporary boolean,
    correct_answer text,
    wrong_answer text ARRAY[3],
    topics_id int REFERENCES topics(id),
    q_tags text ARRAY[10],
    q_author int,
    q_posttime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- -- Väliaikainen kysymystaulu (käytetään, kun tehdään quiz kysymyksestä tallentamatta kysymystä pysyvästi)
-- CREATE TABLE temporaryquestions(
--     id SERIAL PRIMARY KEY,
--     question text NOT NULL,
--     correct_answer text,
--     wrong_answer text ARRAY[3],
--     topics_id int REFERENCES topics(id),
--     q_author int,
--     q_posttime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
-- Quiz-taulu
CREATE TABLE quizzes(
    id SERIAL PRIMARY KEY,
    title text NOT NULL,
    question_ids INT ARRAY[10],
    isTemporary boolean,
    quiz_badge VARCHAR(255) NOT NULL UNIQUE,
    quiz_author int REFERENCES users(teacher_badge),
    quiz_type boolean,
    quiz_posttime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tulokset -taulu
CREATE TABLE scores(
    id SERIAL PRIMARY KEY,
    nickname text NOT NULL,
    question_ids INTEGER ARRAY[20],
    user_answer text ARRAY[20],
    quiz_badge VARCHAR(255) REFERENCES quizzes(quiz_badge),
    result_tag VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*Käyttäjän salasana on Testi123*/
INSERT INTO users(login, password, teacher_badge) VALUES('testi@testi.com', '$2y$04$KaSD2fmFDrW0kStfzJ580.8oj.DdfYyP3eOdaeTukoIGW8VUKyAP2', 12345);

INSERT INTO topics(title, posttime, isTemporary) VALUES('React', DEFAULT, 'f');
INSERT INTO topics(title, posttime, isTemporary) VALUES('Scrum', DEFAULT, 'f');
INSERT INTO topics(title, posttime, isTemporary) VALUES('CSS', DEFAULT, 'f');
INSERT INTO topics(title, posttime, isTemporary) VALUES('Python', DEFAULT, 'f');
INSERT INTO topics(title, posttime, isTemporary) VALUES('Angular', DEFAULT, 'f');
INSERT INTO topics(title, posttime, isTemporary) VALUES('AWS', DEFAULT, 'f');
INSERT INTO topics(title, posttime, isTemporary) VALUES('SQL', DEFAULT, 'f');
INSERT INTO topics(title, posttime, isTemporary) VALUES('HTML', DEFAULT, 'f');
 INSERT INTO questions(topics_id, q_tags, question, correct_answer, wrong_answer, q_posttime) VALUES (1, '{"react", "javascript", "hooks", "props"}', 'Is this easy', 'no', '{"yes", "kind of", "not sure"}', DEFAULT);
 INSERT INTO questions(topics_id, q_tags, question, correct_answer, wrong_answer, q_posttime) VALUES (1, '{"react"}', 'Who is a good boy?', 'The dog is', '{"Not me", "Possibly me", "Jesus Christ Superstar"}', DEFAULT);
 INSERT INTO questions(topics_id, q_tags, question, correct_answer, wrong_answer, q_posttime) VALUES (1, '{"javascript", "react"}', 'How big is the world?', 'Yambalayaa!', '{"Mambo number 5", "Scaramouche, scaramouche!", "Nothing matters to meeeeeee"}', DEFAULT);
 INSERT INTO questions(topics_id, q_tags, question, correct_answer, wrong_answer, q_posttime) VALUES (1, '{"react", "javascript", "data"}', 'In React what is used to pass data to a component from outside?', 'props', '{"setState", "render with arguments", "PropTypes"}', DEFAULT);
 INSERT INTO questions(topics_id, question, correct_answer, wrong_answer, q_posttime) VALUES (1, 'What are the two ways that data gets handled in React?', 'state & props', '{"services & components"}', DEFAULT);
INSERT INTO questions(topics_id, q_tags, question, correct_answer, wrong_answer, q_posttime) VALUES (3, '{"stylesheet", "css3"}', 'What does CSS stand for?', 'Cascading Style Sheets', '{"Computer Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"}', DEFAULT );
INSERT INTO questions(topics_id, q_tags, question, correct_answer, wrong_answer, q_posttime) VALUES (8, '{"html5"}', 'Where in an HTML document is the correct place to refer to an external style sheet?', 'In the <head> section', '{"In the <body> section", "At the end of the document", "You cant refer to an external style sheet"}', DEFAULT );
INSERT INTO questions(topics_id, question, correct_answer, wrong_answer, q_posttime) VALUES (8, 'Where in an HTML document is the correct place to refer to an external style sheet?', 'In the <head> section', '{"In the <body> section", "At the end of the document", "You cant refer to an external style sheet"}', DEFAULT );
INSERT INTO questions(topics_id, question, correct_answer, wrong_answer, q_posttime) VALUES (8, 'Which HTML tag is used to define an internal style sheet?', '<style>', '{"<script>", "<headStyle>", "<css>"}', DEFAULT );
INSERT INTO questions(topics_id, question, correct_answer, wrong_answer, q_posttime) VALUES (3, 'Which is the correct CSS syntax?', 'body {color: black;}', '{"body:color=black;", "{body;color:black;}", "{body:color=black;}"}', DEFAULT );
INSERT INTO questions(topics_id, question, correct_answer, wrong_answer, q_posttime) VALUES (3, 'How do you insert a comment in a CSS file?', '/* this is a comment */', '{"\ this is a comment", "// this is a comment", "// this is a comment //"}', DEFAULT );
INSERT INTO questions(topics_id, question, correct_answer, wrong_answer, q_posttime) VALUES (3, 'Which property is used to change the background color?', 'background-color', '{"bgColor", "bgcolor", "color"}', DEFAULT );
INSERT INTO questions(topics_id, question, correct_answer, wrong_answer, q_posttime) VALUES (3, 'How do you add a background color for all <h1> elements?', 'h1 {background-color:#FFFFFF;}', '{"h1.all {background-color:#FFFFFF;}", "h1.setAll {background-color:#FFFFFF;}", "all.h1 {background-color:#FFFFFF;"}', DEFAULT );


INSERT INTO questions(topics_id, q_tags, question, correct_answer, wrong_answer, q_posttime) VALUES (2, '{"scrum", "productowner", "sprint", "developmentteam"}', 'Who is responsible for managing the progress of work during a Sprint?', 'The Development Team', '{"The Product Owner", "The most junior member of the Team", "The Scrum Master"}', DEFAULT );


INSERT INTO questions(topics_id, question, correct_answer, wrong_answer, q_posttime) VALUES (2, 'True or False: It is mandatory that the product increment be released to production at the end of each Sprint.', 'False', '{"True"}', DEFAULT );

INSERT INTO questions(topics_id, question, correct_answer, wrong_answer, q_posttime) VALUES (2, 'When does the next Sprint begin?', 'Immediately after the conclusion of the previous Sprint.', '{"Immediately following the next Sprint Planning.", "Next Monday.", "When the Product Owner is ready."}', DEFAULT );
INSERT INTO questions(topics_id, question, correct_answer, wrong_answer, q_posttime) VALUES (2, 'Who is required to attend the Daily Scrum?', 'The Development Team.', '{"The Scrum team.", "The Scrum Master and Product Owner.", "The Development Team and Product Owner."}', DEFAULT );
INSERT INTO questions(topics_id, question, correct_answer, wrong_answer, q_posttime) VALUES (2, 'Upon what type of process control is Scrum based?', 'Empirical', '{"Defined", "Complex", "Hybrid"}', DEFAULT );
INSERT INTO questions(topics_id, question, correct_answer, wrong_answer, q_posttime) VALUES (2, 'The three pillars of empirical process control are:', 'Inspection, Transparency, Adaptation', '{"Planning, Inspection, Adaptation", "Transparency, Eliminating Waste, Kaizen", "Planning, Demonstration, Retrospective"}', DEFAULT );

INSERT INTO quizzes(title, question_ids, quiz_badge) VALUES('Kiitos 1995', ARRAY[1,2,3,5], 7);

INSERT INTO scores(nickname, question_ids, user_answer, quiz_badge) VALUES('Piia', ARRAY[1,2,3,5], ARRAY['yes', 'The dog is', 'Yambalayaa!', 'services & components'], 7);
INSERT INTO scores(nickname, question_ids, user_answer, quiz_badge) VALUES('Tuutti', ARRAY[1,2,3,5], ARRAY['no', 'The dog is', 'Scaramouche, scaramouche!', 'services & components'], 7);
INSERT INTO scores(nickname, question_ids, user_answer, quiz_badge) VALUES('Kuutti', ARRAY[1,2,3,5], ARRAY['no', 'Not me', 'Mambo number 5', 'services & components'], 7);
INSERT INTO scores(nickname, question_ids, user_answer, quiz_badge) VALUES('Buutti', ARRAY[1,2,3,5], ARRAY['yes', 'Possibly me', 'Scaramouche, scaramouche!', 'services & components'], 7);
INSERT INTO scores(nickname, question_ids, user_answer, quiz_badge) VALUES('Luutti', ARRAY[1,2,3,5], ARRAY['kind of', 'Not me', 'Scaramouche, scaramouche!', 'services & components'], 7);
INSERT INTO scores(nickname, question_ids, user_answer, quiz_badge) VALUES('Scuutti', ARRAY[1,2,3,5], ARRAY['not sure', 'Possibly me', 'Mambo number 5', 'state & props'], 7);
INSERT INTO scores(nickname, question_ids, user_answer, quiz_badge) VALUES('Koontti', ARRAY[1,2,3,5], ARRAY['not sure', 'Not me', 'Mambo number 5', 'state & props'], 7);
INSERT INTO scores(nickname, question_ids, user_answer, quiz_badge) VALUES('Toontti', ARRAY[1,2,3,5], ARRAY['not sure', 'Possibly me', 'Mambo number 5', 'state & props'], 7);
INSERT INTO scores(nickname, question_ids, user_answer, quiz_badge) VALUES('Roontti', ARRAY[1,2,3,5], ARRAY['not sure', 'Jesus Christ Superstar', 'Mambo number 5', 'state & props'], 7);
INSERT INTO scores(nickname, question_ids, user_answer, quiz_badge) VALUES('Truukki', ARRAY[1,2,3,5], ARRAY['not sure', 'Jesus Christ Superstar', 'Yambalayaa!', 'state & props'], 7);

/* CREATE TABLE quizzes(
    id SERIAL PRIMARY KEY,
    title text NOT NULL,
    question_ids INT ARRAY[10],
    quiz_badge VARCHAR(255) NOT NULL UNIQUE,
    quiz_author int REFERENCES users(teacher_badge),
    quiz_posttime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); */