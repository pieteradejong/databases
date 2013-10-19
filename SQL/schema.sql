CREATE DATABASE chat;

USE chat;

CREATE TABLE messages (
  ID int(11) NOT NULL auto_increment,
  text TINYTEXT,
  FOREIGN KEY (user_id)
    REFERENCES user(id),
  FOREIGN KEY (room_id)
    REFERENCES room(id),
  PRIMARY KEY (ID)
);

CREATE TABLE friends (
  ID int(11) NOT NULL auto_increment,
  FOREIGN KEY (follower_id)
    REFERENCES user(id),
  FOREIGN KEY (followed_id)
    REFERENCES user(id),
  PRIMARY KEY (ID)
);

CREATE TABLE rooms (
  ID int(11) NOT NULL auto_increment,
  NAME VARCHAR(255),
  PRIMARY KEY (ID)
);

CREATE TABLE blocked (
  ID int(11) NOT NULL auto_increment,
  FOREIGN KEY (blocker_id)
    REFERENCES user(id),
  FOREIGN KEY (blocked_id)
    REFERENCES user(id),
  PRIMARY KEY (ID)
);

CREATE TABLE user(
  ID int(11) NOT NULL auto_increment,
  USERNAME VARCHAR(255),
  PRIMARY KEY (ID)
);
 -- *    mysql < schema.sql