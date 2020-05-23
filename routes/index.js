var passport    = require('passport');
var express     = require('express');
//var {checkAuth} = require('../middelware/checkAuth');
var jwt         = require('jsonwebtoken');
var bcrypt      = require('bcrypt');

function createToken(user) {
    return jwt.sign({ id: user._id, email: user.email }, "tourterrain", {
        expiresIn: 200 // 86400 expires in 24 hours
      });
}

// Models
var User = require('../models/user');
var Questionnaire = require('../models/questionnaire');
var Question = require('../models/question');
var Recap = require('../models/recap');

// Express router
var router = express.Router();

router.get('/Utilisateurs', passport.authenticate('jwt', {session: false}), function (req, res) {
  User.find({}, function (err, users) {
    if (err) res.status(500).json({error_msg: 'Internal Error'});
    else {
      res.status(200).json(users);
    }
  })
});

router.get("/questionnaires", passport.authenticate('jwt', {session: false}), function (req, res) {
  Questionnaire.find({}, function (err, questionnaires) {
    if (err) res.status(500).json(err);
    else {
      res.json(questionnaires);
    }
  })
});

// afficher questionnaire avec questions
router.get("/questionnaire/:id", passport.authenticate('jwt', {session: false}), function (req, res) {
  Questionnaire.findOne({_id: req.params.id}, function (error, questionnaire) {
    if (error) res.status(500).json({error_msg: error});
    else {
      Question.find({questionnaireID: req.params.id}, function(err, questions) {
        if (error) res.status(500).json({error_msg: err});
        else {
          res.status(200).json({questionnaire: questionnaire, questions: questions});
        }
      });
    }
  })
});

router.post("/reponse/:id", passport.authenticate('jwt', {session: false}), function (req, res) {
  Recap.create({
    etablissement: req.body.etablissement,
    site: req.body.site,
    questionnaireID: req.params.id,
    userID: req.user._id,
    date: req.body.date,
    positif: req.body.positif,
    negatif: req.body.negatif
  }, function (err, recap) {
    if (err) res.status(500).json(err);
    else {
      req.body.questions.forEach(function(question) {
        Reponse.create({
          recapID          : recap._id,
          contenu_question : question.contenu,
          reponse          : question.reponse,
          commentaire      : question.commentaire
        }, function (error) {
          if (error) res.status(500).json(error);
        });
      });
    }
  });
});

//router.post("/recap")

// how to add new responses recap ? how to

module.exports = router;
