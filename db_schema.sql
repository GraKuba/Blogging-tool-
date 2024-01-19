
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

-- Create your tables with SQL commands here (watch out for slight syntactical differences with SQLite vs MySQL)

CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    email_address TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS draft_articles (
    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL, 
    content TEXT NOT NULL, 
    created TIMESTAMP,   
    last_modified TIMESTAMP,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)      
);

CREATE TABLE IF NOT EXISTS published_articles (
    article_id INTEGER PRIMARY KEY AUTOINCREMENT, 
    title TEXT NOT NULL, 
    content TEXT NOT NULL, 
    created TEXT NOT NULL,    
    published TIMESTAMP, 
    likes INTEGER,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Insert default data (if necessary here)

-- Set up four users
INSERT INTO users ('user_name', 'email_address') VALUES ('Jakub Grabarczyk', 'grabarczyk.kuba@gmail.com');
INSERT INTO users ('user_name', 'email_address') VALUES ('Simon Star', 'simon@gmail.com');
INSERT INTO users ('user_name', 'email_address') VALUES ('Dianne Dean', 'dianne@yahoo.co.uk');
INSERT INTO users ('user_name', 'email_address') VALUES ('Harry Hilbert', 'harry1234@gmail.com');

-- Create two draft articles
INSERT INTO draft_articles ('title', 'content', 'created', 'last_modified', 'user_id') VALUES ('First article', 'Hello', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2);
INSERT INTO draft_articles ('title', 'content', 'created', 'last_modified', 'user_id') VALUES ('Second article', 'Hello', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2);

-- One published article 
INSERT INTO published_articles ('title', 'content', 'created', 'published', 'likes', 'user_id') VALUES ('First article', 'Hello', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, 1);

COMMIT;

