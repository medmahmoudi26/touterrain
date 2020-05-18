
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecapeSchema = new Schema ({
  etablissement   : {type: String, required: true},
  site            : {type: String, required: true},
  questionnaireID : {type: String, required: true},
  userID          : {type: String, required: true},
  positif         : {type: String, required: false},
  negatif        : {type: String, required: false}
});

module.exports = mongoose.model('recap', RecapeSchema);
