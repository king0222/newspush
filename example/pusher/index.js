var app = require('./app');
var server = require('http').Server(app);
server.listen(8000, function() {
	console.log('server listen on port 8000');
});