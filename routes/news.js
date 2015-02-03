var setting = require('../setting');

var newsService = null;
var subscribeService = null;

if (setting.dbType == 'mongoose') {
	newsService = require('../service/news');
	subscribeService = require('../service/subscribe');
}
if (setting.dbType == 'mysql') {
	newsService = require('../db/news');
	subscribeService = require('../db/subscribe');
}




module.exports = function(app) {
	//对外接口，通过白名单来屏蔽其他调用
	app.post('/setinfo', function(req, res) {
		if (setting.WHITE_LIST.length && setting.WHITE_LIST.indexOf(req.hostname) == -1) {
			return res.json({success: false, err: '抱歉，您无权限推送消息！'});
		}
		var info = req.body;
		if (!info.user) {
			return res.json({success: false, err: '参数必须包含用户ID'});
		}
		if (!info.type) {
			info.type = 0;
		}
		//首先查找当前用户有无推送项目，若有则将数据插入数据库并推送，若无则返回相应信息
		subscribeService.find({user: info.user}, function(err, data) {
			if (err) {
				return res.json({success: false, err: err});
			}
			//如果查找到存在用户信息则过滤用户选择的推送选项，否则直接插入消息
			if (data && data.length) {
				var item = data[0];
				var tag = false;
				var SUBSCRIBE_MAP = subscribeService.SUBSCRIBE_MAP;
				for (var i in SUBSCRIBE_MAP) {
					if (SUBSCRIBE_MAP[i] == info.type && item[i]) {
						tag = true;		
					}
				}
				if (tag) {
					newsService.insert(info, function(err, item) {
						if (err) {
							return res.json({success: false, err: err});
						}
						if (app.sockets[info.user]) {
							app.sockets[info.user].emit('news', {data: [item]});
						}
					});
				} else {
					return res.json({success: false, err: '用户设置不推送任何消息！'});
				}
			} else {
				newsService.insert(info, function(err, item) {
					if (err) {
						return res.json({success: false, err: err});
					}
					if (app.sockets[info.user]) {
						app.sockets[info.user].emit('news', {data: [item]});
					}
				});
			}
			res.json({success: true, data: '消息推送成功'});
		});
		
	});

	app.get('/setinfo', function(req, res) {
		var query = req.query;
		var cb = query.callback;
		res.writeHeader(200, {'Content-Type':'text/plain;charset=UTF-8'});
		if (!cb) {
			return res.end(cb + '('+JSON.stringify({success: false, err: '抱歉，您必须将callback作为url参数传入！'})+')');
		}
		if (!inWhiteList(req.hostname)) {
			return res.end(cb + '('+JSON.stringify({success: false, err: '抱歉，您无权限推送消息！'})+')');
		}
		var user = query.user;
		if (!user) {
			return res.end(cb + '(' + JSON.stringify({success: false, err: '参数必须包含用户ID'}) + ')');
		}
		var title = query.title;
		var content = query.content;
		var type = query.type;
		var info = {
			title: title,
			content: content,
			user: user
		};
		if (type) {
			info.type = type;
		} else {
			info.type = 0;
		}
		//首先查找当前用户有无推送项目，若有则将数据插入数据库并推送，若无则返回相应信息
		subscribeService.find({user: info.user}, function(err, data) {
			if (err) {
				return res.json({success: false, err: err});
			}
			//如果查找到存在用户信息则过滤用户选择的推送选项，否则直接插入消息
			if (data && data.length) {
				var item = data[0];
				var tag = false;
				var SUBSCRIBE_MAP = subscribeService.SUBSCRIBE_MAP;
				for (var i in SUBSCRIBE_MAP) {
					if (SUBSCRIBE_MAP[i] == info.type && item[i]) {
						tag = true;		
					}
				}
				if (tag) {
					newsService.insert(info, function(err, item) {
						if (err) {
							return res.end(cb + '(' +JSON.stringify({success: false, err: err})+')');
						}
						if (app.sockets[info.user]) {
							app.sockets[info.user].emit('news', {data: [item]});
						}
					});
				} else {
					return res.end(cb + '(' + JSON.stringify({success: false, err: '用户设置不推送任何消息！'}) + ')');
				}
			} else {
				newsService.insert(info, function(err, item) {
					if (err) {
						return res.end(cb + '(' + JSON.stringify({success: false, err: err}) + ')');
					}
					if (app.sockets[info.user]) {
						app.sockets[info.user].emit('news', {data: [item]});
					}
				});
			}
			res.end(cb + '(' + JSON.stringify({success: true, data: '消息推送成功'})+')') ;
		});
	});

	//通过用户名来查找消息
	//返回数据格式： {success: true, data: [...]}; or {success: false, err: err};
	app.get('/item/find/:id', function(req, res) {
		var obj = {};
		var userid = req.params.id;
		//用户ID为all的无法进行查询
		if (userid != 'all') {
			obj.user = userid;
		}
		if (obj.user) {
			newsService.filterBySubscribe(obj,function(err, data) {
				if (err) {
					res.json({success: false, err: err});
				}
				res.json({success: true, data: data});
			});	
		}		
	});

	//添加消息
	app.post('/item/add', function(req, res) {
		newsService.insert(req.body, function(err, news) {
			if (err) {
				res.json({success: false, err: err});
			}
			if (news) {
				res.json({success: true, data: news});
			}
		});
	});

	//删除消息
	app.get('/item/remove/:id', function(req, res) {
		var id = req.params.id;
		var query = req.query,
			callback = query.callback;
		newsService.remove({_id: id}, function(err, data) {
			if (err) {
				if (callback) {
					res.end(callback + '(' + JSON.stringify({success: false, err: err}) + ')');
				} else {
					res.json({success: false, err: err});	
				}				
			}
			if (data) {
				if (callback) {
					res.end(callback + '(' + JSON.stringify({success: true, data: data}) + ')');
				} else {
					res.json({success: true, data: data});		
				}				
			}			
		});
	});

	//更新消息
	app.post('/item/update', function(req, res) {
		newsService.update(req.body, function(err, data) {
			if (err) {
				res.json({success: false, err: err});
			}
			if (data) {
				res.json({success: true, data:data});
			}
		});
	});


	app.post('/subscribe/setting', function(req, res) {
		var opt = req.body;
		var user = opt.user;
		var query = req.query,
			callback = query.callback;
		subscribeService.findAndUpsert(opt, function(err, data) {
			if (err) {
				if (callback) {
					res.end(callback + '(' + JSON.stringify({success: false, err: err}) + ')');
				} else {
					res.json({success: false, err: err});	
				}				
			}
			if (data) {
				if (callback) {
					res.end(callback + '(' + JSON.stringify({success: true, data: data}) + ')');
				} else {
					res.json({success: true, data: data});	
				}				
			}
		});
	});

	app.get('/subscribe/setting', function(req, res) {
		var query = req.query;
		var user = query.user,
			callback = query.callback;
		if (callback) {
			delete query.callback;
		}
		subscribeService.findAndUpsert(query, function(err, data) {
			if (err) {
				if (callback) {
					res.end(callback + '(' + JSON.stringify({success: false, err: err}) + ')');
				} else {
					res.json({success: false, err: err});	
				}				
			}
			if (data) {
				if (callback) {
					res.end(callback + '(' + JSON.stringify({success: true, data: data}) + ')');
				} else {
					res.json({success: true, data: data});	
				}				
			}
		});
	});

	app.get('/news/getusers', function(req, res) {
		var query = req.query,
			callback = query.callback;
		newsService.getUsers(function(err, data) {
			if (err) {
				if (callback) {
					res.end(callback + '(' + JSON.stringify({success: false, err: err}) + ')');
				} else {
					res.json({success: false, err: err});	
				}
				
			}
			if (data) {
				if (callback) {
					res.end(callback + '(' + JSON.stringify({success: true, data: data}) + ')');
				} else {
					res.json({success: true, data: data});	
				}
				
			}
		});
	});


	function inWhiteList(host) {
		if (setting.WHITE_LIST.length && setting.WHITE_LIST.indexOf(host) == -1) {
			return false;
		}
		return true;
	}


	function getNewsByUser(obj, cb) {
		if (!obj && !obj.user) {
			if (cb) {
				return cb({success: false, err: '请传入正确的参数!'});
			}
		}
		newsService.filterBySubscribe(obj, function(err, data) {
			if (err) {
				if (cb) {
					return cb({success: false, err: err});
				}
				
			}
			if (cb) {
				return cb({success: true, data: data});
			}
		});
	}

	return {
		getNewsByUser: getNewsByUser
	};
}
