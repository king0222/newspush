var mongoose = require('mongoose');
var subscribeSchema = require('../schemas/subscribe');
var Subscribe = mongoose.model('Subscribe', subscribeSchema);

Subscribe.SUBSCRIBE_ITEM = 'inquirys orders returns';

module.exports = Subscribe;
