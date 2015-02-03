var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bunyan = require('bunyan');
var log = bunyan.createLogger({
    name: 'newsLog',
    //path: '/var/tmp/news/news.log'
    streams: [
        {
            level: 'info',
            type: 'rotating-file',
            path: __dirname + '/log/newsinfo.log',  // log info and above to a file
            period: '1d',   // daily rotation
            count: 3        // keep 3 back copies
        },
        {
            level: 'error',
            type: 'rotating-file',
            path: __dirname + '/log/newsErr.log',  // log ERROR and above to a file
            period: '1d',   // daily rotation
            count: 3        // keep 3 back copies
        }
    ]
});


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
app.log = log;
// view engine setup
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));


/*路由设置*/
app.use('/', routes);
app.use('/users', users);
require('./routes/news')(app);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;




