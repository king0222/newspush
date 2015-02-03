
var News = require('../model/news');
var Subscribe = require('../model/subscribe');

var MAX_SIZE = 10;
var SUBSCRIBE_MAP = {
	inquirys: 1,
	orders: 2,
	returns: 3
};
var SUBSCRIBE_ITEM = 'inquirys orders returns';




// news增删改查
module.exports = {
	//查找
	find: function(option,cb) {
		News.find(option).exec(function(err,news){
			if (err) {
				if (cb) {
					return cb(err);
				}
			}
			if (cb) {
				cb(null, news);
			}
		});
	},

	//添加消息
	insert: function(option, cb) {
		var self = this;
		var news = new News(option);
		news.save(function(err, news, num) {
			if (err) {
				if (cb) {
					return cb(err);
				}

			}
			if (news) {
				if (cb) {
					cb(null, news);
				}
			}
			self.removeRedundantNews(news);
		});
	},

	//更新消息
	update: function(option, cb) {
		News.update({_id: option._id}, {"$set": option}, function(err, item) {
			if (err) {
				if (cb) {
					return cb(err);
				}
			}
			if (cb) {
				cb(null, item);
			}
		});
	},

	updateMulNews: function(array, cb) {

	},

	//删除消息,option is a object params
	remove: function(option, cb) {
		News.remove(option, function(err, num) {
			if (err) {
				if (cb) {
					return cb(err);
				}
			}
			if (cb) {
				cb(null, num);
			}
		});
	},

	//删除多余的信息（如果数据库存储针对某个用户数据条数大于XX的话，则删除早期数据）
	removeRedundantNews: function(option) {
		News.find({user: option.user}).sort({"date": -1}).skip(MAX_SIZE).exec(function(err, item) {
			if (err) {
				return app.log.error(err);
			}
			if (item.length > 0) {
				for(var i = 0, j = item.length; i < j; i++) {
					News.remove(item[i], function(err, num) {
						if (err) {
							return app.log.error(err);
						}
					});	
				}
			}
		});
	},

	//filterBySubscribe({user: user})
	filterBySubscribe: function(option, cb) {
		if (Object.prototype.toString.call(option) != '[object Object]') {
			if (cb) {
				return cb('参数必须传递用户ID');
			}
			return false;
		}
		var self = this;
		//只拿出inquirys orders reurns字段值
		Subscribe.findOne(option, SUBSCRIBE_ITEM, function(err, item) {
			if (err) {
				if (cb) {
					return cb(err);
				}
			}
			var filterType = [];  //[1,3]
			/*item = { _id: 54b91e81250a
				returns: false,
				orders: false,
				inquirys: true }*/
			if (item) {
				var subscribeArr = SUBSCRIBE_ITEM.split(' ');
				for (var i = 0, j = subscribeArr.length; i < j; i++) {
					if (item[subscribeArr[i]]) {
						filterType.push(SUBSCRIBE_MAP[subscribeArr[i]]);
					}
				}
				if (filterType.length) {
					option['type'] = {"$in": filterType};
				}
				//查找所有字段，按日期倒序排列
				News.find(option, null, {sort:[{date: -1}]}, function(err, data) {
					if (err) {
						if (cb) {
							return cb(err);
						}
					}
					if (cb) {
						cb(null, data);
					}
				});
			} else {
				News.find(option, null, {sort:[{date: -1}]}, function(err, data) {
					if (err) {
						if (cb) {
							return cb(err);
						}
					}
					if (cb) {
						cb(null, data);
					}
				});
			}
			
		});
	},

	getUsers: function(cb) {
		News.distinct('user', function(err, data) {
			console.log(err);
			console.log(data);
			if (err) {
				if (cb) {
					return cb(err);
				}
			}
			if (data) {
				if (cb) {
					var arr = [];
					for (var i = 0, j = data.length; i < j; i++) {
						var o = {
							'user': data[i]
						};
						arr.push(o);
					}
					cb(null, arr);
				}
			}
		});
	}

};