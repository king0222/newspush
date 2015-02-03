var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  userName: {type: String, index: true},
  email: {type: String},
  password: {type: String, required: true},
  type: {type: Number}
});
module.exports = userSchema;