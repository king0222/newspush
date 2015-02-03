var mongoose = require('mongoose');
var newsSchema = require('../schemas/news');
var News = mongoose.model('News', newsSchema);

module.exports = News;
