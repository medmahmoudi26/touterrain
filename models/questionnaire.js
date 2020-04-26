
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionnaireSchema = new Schema ({
  titre           : {type: String, required: true},
  etablissement   : {type: String, required: true},
  site            : {type: String, required: true},
  commentaire     : {type: String, required: true}
});

module.exports = mongoose.model('user', QuestionnaireSchema);
