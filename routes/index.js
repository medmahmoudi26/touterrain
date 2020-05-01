var passport    = require('passport');
var express     = require('express');
//var {checkAuth} = require('../middelware/checkAuth');
var jwt         = require('jsonwebtoken');
var bcrypt      = require('bcrypt');

function createToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, "tourterrain", {
        expiresIn: 200 // 86400 expires in 24 hours
      });
}

// Models
var User = require('../models/user');
var Questionnaire = require('../models/questionnaire');
var Question = require('../models/question');

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
  Questionnaires.find({}, function (err, questionnaires) {
    if (err) res.status(500).json(err);
    else {
      res.json(questionnaires);
    }
  })
});

router.get("/questionnaire/:id", passport.authenticate('jwt', {session: false}), function (req, res) {
  Questionnaire.find({_id: req.params.id}, function (err, questionnaire) {
    if (err) res.status(500).json(err);
    else {
      res.status(200).json(questionnaire);
    }
  })
});


router.post("/reponse/:id", passport.atheticate('jwt', {session: false}), function (req, res) {
  Recap.create({
    etablissement: req.body.etablissement,
    site: req.body.site,
    questionnaireID: req.params.id,
    userID: req.user._id
  }, function (err, recap) {
    if (err) res.status(500).json(err);
    else {
      req.body.questions.forEach(question) {
        Reponse.create({
          recapID          : recap._id,
          contenu_question : question.contenu,
          reponse          : question.reponse,
          commentaire      : question.commentaire
        }, function (error) {
          if (error) res.status(500).json(error);
        });
      }
    }
  });
});


// how to add new responses recap ? how to

module.exports = router;
