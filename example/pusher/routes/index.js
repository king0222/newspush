var express = require('express');
var router = express.Router();
var net = require('net');
var http = require('http');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'News pusher' });
});

router.get('/newspush/setinfo', function(req, ress) {
	var data = {
		'user': 'user_1421649662300',
		'title': 'title1',
		'content': 'content1'
	};
	data = require('querystring').stringify(data);  

	var options = {
	  hostname: '127.0.0.1',
	  port: 8080,
	  path: '/setinfo',
	  method: 'POST',
	  headers: {  
		'Content-Type': 'application/x-www-form-urlencoded',  
		'Content-Length': data.length  
	  }
	};

	var req = http.request(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));

	  res.setEncoding('utf8');
	  var dlen = 0, body = "";
	  res.on('data', function (chunk) {
	    body += chunk;
	  }).on('end', function() {
	  	//ress.writeHeader(200, {'Content-Type':'text/plain;charset=UTF-8'});
	  	ress.json(body);
	  }).on('error', function() {
	  	ress.writeHeader(500, {'Content-Type':'text/plain;charset=UTF-8'});
	  	ress.send(500, 'request error');
	  });
	});
	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});
	req.write(data);
	req.end();

});

router.post('/newspush/setinfo', function(req, ress) {
	var data = req.body;
	data = require('querystring').stringify(data);  

	var options = {
	  hostname: '127.0.0.1',
	  port: 8080,
	  path: '/setinfo',
	  method: 'POST',
	  headers: {  
		'Content-Type': 'application/x-www-form-urlencoded',  
		'Content-Length': data.length  
	  }
	};

	var req = http.request(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));

	  res.setEncoding('utf8');
	  var dlen = 0, body = "";
	  res.on('data', function (chunk) {
	    body += chunk;
	  }).on('end', function() {
	  	//ress.writeHeader(200, {'Content-Type':'text/plain;charset=UTF-8'});
	  	ress.json(body);
	  }).on('error', function() {
	  	ress.writeHeader(500, {'Content-Type':'text/plain;charset=UTF-8'});
	  	ress.send(500, 'request error');
	  });
	});
	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});
	req.write(data);
	req.end();

});

module.exports = router;
