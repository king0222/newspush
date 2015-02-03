var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newsSchema = new Schema({
  user: {type: String, index: true},
  type: {type: Number, required: true,default: 0},
  template: String,
  title: {type:String, required: true},
  content: {type:String, required: true},
  detailUrl: String,
  date: { type: Date, default: Date.now }
});
module.exports = newsSchema;



//create a modal
//var News = mongoose.model('News', newsSchema);

//define a instance method
/*var animalSchema = new Schema({ name: String, type: String });

// assign a function to the "methods" object of our animalSchema
animalSchema.methods.findSimilarTypes = function (cb) {
  return this.model('Animal').find({ type: this.type }, cb);
}

var Animal = mongoose.model('Animal', animalSchema);
var dog = new Animal({ type: 'dog' });

dog.findSimilarTypes(function (err, dogs) {
  console.log(dogs); // woof
});

//define static method
// assign a function to the "statics" object of our animalSchema
animalSchema.statics.findByName = function (name, cb) {
  this.find({ name: new RegExp(name, 'i') }, cb);
}

var Animal = mongoose.model('Animal', animalSchema);
Animal.findByName('fido', function (err, animals) {
  console.log(animals);
});

//this happens before it saves, they are called middleware
BlogPost.pre('save', function(next){
	console.log('Saving...');
	next();
});*/