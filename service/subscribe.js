
var Subscribe = require('../model/subscribe');

// newsÔöÉ¾¸Ä²é
module.exports = {
	SUBSCRIBE_MAP: {
		inquirys: 1,
		orders: 2,
		returns: 3
	},

	SUBSCRIBE_ITEM: 'inquirys orders returns',

	find: function(option, cb) {
		var self = this;
		Subscribe.find(option).exec(function(err, subscribe) {
			if (err) {
				if (cb) {
					return cb(err);	
				}				
			}
			if (subscribe && subscribe.length) {
				if (cb) {
					cb(null, subscribe);
				}	
			} else {
				self.add(option, function(err, subscribe) {
					if (err) {
						if (cb) {
							return cb(err);
						}
					}
					if (subscribe) {
						if (cb) {
							cb(null, [subscribe]);
						}
					}
				});
			}
			
		});
	},
	
	findAndUpsert: function(filterOption, cb) {
		var self = this;
		self.find({user: filterOption.user}, function(err, items) {
			if (err) {
				if (cb) {
					return cb(err);
				}
			}
			if (items.length) {
				Subscribe.update({user: filterOption.user}, {"$set": filterOption}, function(err, item) {
					if (err) {
						if (cb) {
							return cb(err);
						}
					}
					if (cb) {
						cb(null, item);
					}
				});
			} else {
				var subscribe = new Subscribe(filterOption);
				subscribe.save(function(err, item, num) {
					if (err) {
						if (cb) {
							return cb(err);	
						}						
					}
					if (cb) {
						cb(null, item);
					}
				});
			}
		});
	},
	add: function(subscribeOption, cb) {
		if (!(subscribeOption instanceof Subscribe)) {
			subscribeOption = new Subscribe(subscribeOption);
		}
		subscribeOption.save(function(err, subscribe, num) {
			if (err) {
				if (cb) {
					return cb(err);
				}
			}
			if (subscribe) {
				if (cb) {
					cb(null, subscribe);
				}
			}
		});
	},
	remove: function(option, cb) {
		Subscribe.remove(option, function(err, num) {
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
	update: function(option, cb) {
		Subscribe.update({_id: option._id}, {"$set": option}, function(err, item) {
			if (err) {
				if (cb) {
					return cb(err);
				}
			}
			if (cb) {
				cb(null, item);
			}
		});
	}

};