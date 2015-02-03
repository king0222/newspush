var db = require('../setting').db;

var subscribeService = {
	SUBSCRIBE_MAP: {
		inquirys: 1,
		orders: 2,
		returns: 3
	},

	SUBSCRIBE_ITEM: 'inquirys orders returns',
	find: function(option, cb) {
		var query = 'select * from subscribe where user = "' + option.user + '"';
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
	insert: function(option, cb) {
		var self = this;
		var fields = '', values = '';
		for (var i in option) {
			fields += i + ',';
			values += '"' + option[i] + '",'
		}
		fields = fields.slice(0, -1);
		values = values.slice(0, -1);

		var query = 'insert into subscribe('+fields+') values('+values+')';
		db.query(query, function(err, data) {
			if (err) {
				if(cb) {
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
	remove: function(option, cb) {
		var query = 'delete from subscribe where user = "'+option.user+'"';
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
	update: function(option, cb) {
		if (!option && !option.user) {
			if (cb) {
				return cb('参数中必须包含user字段');
			}
		}
		var fields = '';
		for (var i in option) {
			fields += ' ' + i + '="' + option[i] + '",';
		}
		fields = fields.slice(0, -1);
		var query = 'update subscribe set ' + fields + ' where user = "'+option.user+'"';
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
	//option: {user: user};
	findAndUpsert: function(option, cb) {
		var self = this;
		if (!option && !option.user) {
			if (cb) {
				return cb('参数中必须包含user字段!');
			}
		}

		var query = 'select * from subscribe where user = "' + option.user + '"';
		db.query(query, function(err, data) {
			if (err) {
				if (cb) {
					return cb(err);	
				}				
			}
			if (data && data.length > 0) {
				if (option.quirys != undefined || option.orders != undefined || option.returns != undefined) {
					var queryStr = [], subscribeItemArr = self.SUBSCRIBE_ITEM.split(' ');
					for (var i in option) {
						if (subscribeItemArr.indexOf(i) != -1) {
							queryStr .push(i + ' = ' + option[i]);
						}
					}
					var uquery = 'update subscribe set ' + queryStr.join(',') + ' where user = "' + option.user + '"';
					
					db.query(uquery, function(err, data) {
						if (err) {
							if (cb) {
								return cb(err);
							}
						}
						self.find(option, function(err, data) {
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
						
					});
				} else {
					self.find(option, function(err, data) {
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
				
			} else {
				var query = 'insert into subscribe(user) values("'+option.user+'")';
				db.query(query, function(err, data) {
					if (err) {
						if(cb) {
							return cb(err);
						}
					}
					self.find(option, function(err, data) {
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
				});
			}
		});		
	}
};

//for test
/*subscribeService.find({user: 'ken'});
subscribeService.insert({user: 'ken', inquirys: 1, returns: 0, orders: 1});
subscribeService.remove({user: 'ken'});
subscribeService.update({user: 'kens', inquirys: 0, returns: 1, orders: 1});*/

module.exports = subscribeService;