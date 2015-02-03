var express = require('express');
var router = express.Router();
var userService = require('../service/user');

/* GET users listing. */
router.get('/', function(req, res) {
	res.send('respond with a resource');
});

router.get('/login', function(req, res) {
	res.render('login', {title: '用户登录'});
});

router.post('/login', function(req, res) {

});

router.get('/reg', function(req, res) {
	res.render('reg', {title: '用户注册'});
});

router.post('/reg', function(req, res) {

});

function isLogin(req, res, next) {
	
}

module.exports = router;
