
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema ({
  questionnaireID : {type: String, required: true},
  contenu         : {type: String, required: true}
});

module.exports = mongoose.model('question', QuestionSchema);
