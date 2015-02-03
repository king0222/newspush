var db = require('../setting').db;
var subscribeService = require('./subscribe');
var MAX_SIZE  = 10;
var SUBSCRIBE_MAP = {
	inquirys: 1,
	orders: 2,
	returns: 3
};
var SUBSCRIBE_ITEM = 'inquirys orders returns';

var newsService = {
	find: function(option, cb) {
		var query = 'select * from news where user = "' + option.user + '"';
		db.query(query, function(err, data, fields) {
			if (err) {
				if (cb) {
					return cb(err);	
				}				
			}
			if (data) {
				/*for (var i = 0; i < data.length; i++) {
					console.log("%s\t%s\t%s", data[i].title, data[i].content, data[i].user);
				}*/
				if (cb) {
					return cb(null, data);
				}
			}
		});
	},
	insert: function(option, cb) {
		var self = this;
		var fields = '', values = '';
		for (var i in option) {
			fields += i + ',';
			values += '"' + option[i] + '",'
		}
		fields = fields.slice(0, -1);
		values = values.slice(0, -1);
		
		var query = 'insert into news('+fields+') values('+values+')';
		db.query(query, function(err, data) {
			if (err) {
				if(cb) {
					return cb(err);
				}
			}
			var fquery = 'select * from news order by date desc limit 1';
			db.query(fquery, function(err, data) {
				if (err) {
					if (cb) {
						return cb(err);
					}
				}
				if (data && data.length) {
					if (cb) {
						cb(null, data[0]);
					}
				}
			});
			
			self.removeRedundantNews({user: option.user});
		});
	},
	remove: function(option, cb) {
		var query = 'delete from news where _id = "'+option._id+'"';
		db.query(query, function(err, data) {
			if (err) {
				if (cb) {
					return cb(err);
				}
			}
			if (data) {
				if (cb) {
					return cb(null, data);
				}
			}
		});
	},
	removeRedundantNews: function(option, cb) {
		var query = 'select _id from news where user = "'+option.user+'" order by date desc limit '+ MAX_SIZE+',1';
		
		db.query(query, function(err, data) {
			if (err) {
				if (cb) {
					cb(err);
				}
			}
			if (data && data.length) {
				var _id = data[0]._id;
				var dquery = 'delete from news where user = "'+option.user+'" and _id <= '+_id + ' order by date desc';
				db.query(dquery, function(err, data) {
					if (err) {
						if (cb) {
							cb(err);
						}
					}
					if (data) {
						if (cb) {
							return cb(data);
						}
					}
					
				});
			}
			
		});
	},
	update: function(option, cb) {
		if (!option && !option._id) {
			if (cb) {
				return cb('参数中必须包含_id字段');
			}
		}
		var fields = '';
		for (var i in option) {
			fields += ' ' + i + '="' + option[i] + '",';
		}
		fields = fields.slice(0, -1);
		var query = 'update news set ' + fields + ' where _id = "'+option._id+'"';
		
		db.query(query, function(err, data) {
			if (err) {
				if (cb) {
					return cb(err);
				}
			}
			if (data) {
				if (cb) {
					cb(null, data);
				}
			}
		});
	},

	//option:{user: user};
	filterBySubscribe: function(option, cb) {
		if (Object.prototype.toString.call(option) != '[object Object]') {
			if (cb) {
				return cb('参数必须传递用户ID');
			}
			return false;
		}
		var self = this;
		subscribeService.findAndUpsert(option, function(err, data) {
			if (err) {
				if (cb) {
					return cb(err);
				}
			}
			if (data && data.length) {
				var item = data[0];
				var filterType = [];
				var subscribeArr = SUBSCRIBE_ITEM.split(' ');
				for (var i = 0, j = subscribeArr.length; i < j; i++) {
					if (item[subscribeArr[i]] != 0) {
						filterType.push('type = ' + SUBSCRIBE_MAP[subscribeArr[i]]);
					}
				}
				filterType = filterType.join(' or ');
				var fquery = 'select * from news where user = "'+option.user+'" and (' + filterType + ')';
				db.query(fquery, function(err, data) {
					if (err) {
						if (cb) {
							return cb(err);
						}
					}
					if (data) {
						if (cb) {
							return cb(null, data);
						}
					}
				});
			}
		});
	},

	getUsers: function(cb) {
		var query = 'select distinct user from news order by user';
		db.query(query, function(err, data) {
			if (err) {
				if (cb) {
					return cb(err);
				}
			}
			if (data) {
				if (cb) {
					return cb(null, data);
				}
			}
		});
	}
};



module.exports = newsService;

