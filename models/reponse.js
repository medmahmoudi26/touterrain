
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReponseSchema = new Schema ({
  recapID          : {type: String, required: true},
  contenu_question : {type: String, required: true},
  reponse          : {type: String, required: true},
  commentaire      : {type: String, required: true}
});

module.exports = mongoose.model('reponse', ReponseSchema);
