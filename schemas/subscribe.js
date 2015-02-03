var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var subscribeSchema = new Schema({
  user: {type: String, unique: true},
  inquirys: {type: Boolean, default: true},
  orders: {type: Boolean, default: true},
  returns: {type: Boolean, default: true}
});
module.exports = subscribeSchema;