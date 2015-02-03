var User = require('../model/user');
var crypto = require('crypto');

// news增删改查
module.exports = {
	find: function(option, cb) {
		User.find(option).exec(function(err,user){
			if (err) {
				if (cb) {
					return cb(err);
				}
			}
			if (cb) {
				cb(null, user);
			}
		});
	},
	add: function(user, cb) {
		var self = this;
		user.save(function(err, user, num) {
			if (err) {
				if (cb) {
					return cb(err);
				}

			}
			if (user) {
				if (cb) {
					cb(null, user);
				}
			}
		});
	},
	remove: function(option, cb) {
		User.remove(option, function(err, num) {
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
		User.update(option, {"$set": option}, function(err, item) {
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
	crypto: function(name) {
		var md5 = crypto.createHash('md5');
		return md5.update(name).digest('hex');
	}
};