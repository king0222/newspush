CREATE DATABASE IF NOT EXISTS news CHARACTER SET UTF8;
USE news;
DROP TABLE IF EXISTS subscribe;
CREATE TABLE subscribe (
user VARCHAR(64) NOT NULL PRIMARY KEY COMMENT '主键',
inquirys tinyint(1) DEFAULT 1,
orders tinyint(1) DEFAULT 1,
returns tinyint(1) DEFAULT 1
);


INSERT INTO subscribe(user) values('kenas');

select * from subscribe;
delete from subscribe where user != "";

update subscribe set inquirys = 1, orders = 1, returns = 1 where user = "user_1421649662306";
drop table subscribe;
select * from subscribe;
