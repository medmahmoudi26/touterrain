
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema ({
  nom           : {type: String, required: true},
  prenom        : {type: String, required: true},
  password      : {type: String, required: true},
  email         : {type: String, required: true, unique:true},
  poste         : {type: String, requrie: true},
  estAdmin      : {type: Boolean, default: false}
});

module.exports = mongoose.model('user',UserSchema);
