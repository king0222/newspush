var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'News Receiver' });
});

//提供外部调用的请求，用于添加数据 
/*router.post('/setinfo', function(req, res) {
	var info = req.body;
	var News = mongoose.model('News', newsSchema);
	var news = new News(info);
	news.save(function(err, item) {
		if (err) {
			return console.log(err);
		}
		console.log(item);
		if (socket) {
			socket.emit('news', { hello: 'world' });	
		}
	});
	res.end('save item success');
});

router.post('/setting', function(req, res) {
	var Authority = mongoose.model('Authority', authoritySchema);
		
});*/

module.exports = router;