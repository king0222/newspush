CREATE DATABASE IF NOT EXISTS news CHARACTER SET UTF8;
USE news;
DROP TABLE IF EXISTS news;
CREATE TABLE news (
_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
user VARCHAR(64) NOT NULL COMMENT '用户名',
template VARCHAR(125),
type INT(2) NOT NULL DEFAULT 0,
title VARCHAR(125) NOT NULL,
content VARCHAR(125) NOT NULL,
detailUrl VARCHAR(125),
date TIMESTAMP DEFAULT current_timestamp
);


INSERT INTO news(user, template, title, content, detailUrl, type) values('bbb', '询价蓝的东西2', '标题s', '内容2', 'ken.com', 1);

delete from news where user in (select * from news where user = 'kens' order by date desc limit 5, 100000);




select * from news order by date desc limit 5,1;
select _id from news where user = "kens" order by date desc limit 3,1;

select * from news where _id <= 10 and user = "kens";

update news set  _id=3, user="fifi", title="haha", content= "forvere" where _id = 3;

delete from news where user = "kens" and _id < 10 order by date desc;
select * from news order by date desc limit 1;
drop table news;

select distinct user from news order by user;
select user, type from news where user != "";