
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReponseSchema = new Schema ({
  questionnaireID  : {type: String, required: true},
  user_id          : {type: String, required: true},
  contenu_question : {type: String, required: true},
  reponse          : {type: String, required: true},
  commentaire      : {type: String, required: true}
});

module.exports = mongoose.model('user', ReponseSchema);
