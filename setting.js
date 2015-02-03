/*global config*/
var dev = false;
var host = '127.0.0.1';
var user = 'news_writer';
var password = 'skj2fds9jsdlk20KLSJD82KJKSDF89sdfkj2slfj0SDFS';
var database = 'news';
var dbType = 'mysql'; //mongoose or mysql


if (dev) {
	user = 'root';
	password = 'admin';
}

/*global config end*/

//db for return
var db = null;

if (dbType == 'mongoose') {
	var mongoose = require('mongoose');
	mongoose.connect('mongodb://' + host + '/' + database);

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		console.log('database has connect!');
		if (callback) {
			callback();
		}
	});

}


if (dbType == 'mysql') {
	var mysql = require('mysql');

	//创建连接池
	var pool  = mysql.createPool({
	  host     : host,
	  user     : user,
	  password : password,
	  database: database
	});

	db = {};
	db.query = function (sql, callback){
		this.getConnection(function (err, connection){
			connection.query(sql, function(){
				callback.apply(connection, arguments);
				connection.release();
			});
		});
	}.bind(pool);

	//监听connection事件
	/*pool.on('connection', function(connection) {
		console.log('database has connect!');
	});

	db = pool;*/
}

module.exports = {
	db: db,
	dbType: dbType,
	WHITE_LIST: []
};