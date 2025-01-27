CREATE database IF NOT EXISTS owlbot;
use owlbot;

CREATE TABLE IF NOT EXISTS user_plannings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL UNIQUE,
    planning_url TEXT NOT NULL
) ENGINE=InnoDB;