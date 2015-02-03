CREATE DATABASE IF NOT EXISTS news CHARACTER SET UTF8;
USE news;
DROP TABLE IF EXISTS userinfo;
CREATE TABLE userinfo (
_id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
email varchar(64) COMMENT '邮箱',
userName varchar(64) NOT NULL COMMENT '用户名',
password varchar(64) NOT NULL COMMENT '密码',
type int(2) NOT NULL DEFAULT 0
);


INSERT INTO userinfo(email, userName, password, type) values('ken@qq.com', 'ken', 'ken', 2);

select * from userinfo;