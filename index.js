var http = require('http'),
	app  = require('./app'),
	setting = require('./setting'),
    news = require('./routes/news')(app),
    server = http.Server(app),
    io   = require('socket.io')(server);

app.io = io;
app.sockets = {};

server.listen(app.get('port'), function() {
    app.log.info('express server listening on port' + app.get('port'));
});

io.sockets.on('connection', function (socket) {
    app.log.info('socket connect');
    socket.on('online', function(data) {
        socket.user = data.user;
        app.sockets[data.user] = socket;
        news.getNewsByUser({user: data.user}, function(data) {
            if (data.success) {
                socket.emit('news', {data: data.data});
            }
        });
        
    });
    socket.on('disconnect', function() {
       app.log.info('socket disconnect');
        if (app.sockets[socket.user]) {
            delete app.sockets[socket.user];    
        }        
        //socket.broadcast.emit('offline', {user: socket.name, users: users});
    });
});

