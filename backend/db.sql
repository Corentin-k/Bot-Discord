CREATE DATABASE IF NOT EXISTS owlbot;
USE owlbot;

CREATE TABLE IF NOT EXISTS user_plannings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL UNIQUE,
    planning_url TEXT NOT NULL,
    user_name TEXT NOT NULL
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    dateEvent DATE NOT NULL,
    heureEvent TIME NOT NULL,
    textEvent VARCHAR(255) NOT NULL,
    notified BOOLEAN DEFAULT 0,
    UNIQUE (user_id, textEvent) 
) ENGINE=InnoDB;
