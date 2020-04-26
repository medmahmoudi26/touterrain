var passport     = require('passport');
var express      = require('express');
//var {checkAuth} = require('../middelware/checkAuth');
var jwt          = require('jsonwebtoken');
var bcrypt       = require('bcrypt');
var {checkAdmin} = require('./middelware/checkAdmin');

var router = express.Router();

function createToken(user) {
    return jwt.sign({ id: user.id, email: user.email, estAdmin: user.estAdmin }, "tourterrain", {
        expiresIn: 200 // 86400 expires in 24 hours
      });
}

router.get("/", passport.authenticate('jwt', { session: false }), checkAdmin, function (req, res) {
  res.status(200).json("Admin page working");
});

router.post('/connexion', function (req, res) {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({error_msg: "Vous devez taper votre email et mot de passe"});
  }
  else {
    User.findOne({email: req.body.email, estAdmin: true}, function (err, user) {
      if (err) {
        res.status(400).json({error_msg: err});
        console.log(err)
      }

      if (!user) {
        res.status(400).json({error_msg: "Utilisateur n'existe pas"});
        console.log("User no exist")
      }

      if (bcrypt.compare(req.body.password, user.password)) {
        res.status(200).json({
          token: createToken(user)
        });
      } else {
        res.status(400).json({error_msg: "Mot de passe non valide"})
      }
    });
  }
});

// afficher tous les questionnaires
router.get("/questionnaires", passport.authenticate('jwt', { session: false }), checkAdmin, function (req, res) {
  Questionnaire.find({}, function (error, questionnaires) {
    if (error) res.status(500).json({error_msg: error});
    else {
      res.status(200).json(questionnaires);
    }
  })
});

// ajouter questionnaire
router.post("/ajouter-questionnaire", passport.authenticate('jwt', {session: false}), checkAdmin, function (req, res) {
  Questionnaire.create({
    titre         : req.body.titre,
    etablissement : req.body.etablissement,
    site          : req.body.site,
    commentaire   : req.body.commentaire
  }, function (error, questionnaire) {
    if (error) res.status(500).json({error_msg: error});
    else {
      res.status(200).json({success_msg: "Questionnaire ajouté", id: questionnaire._id});
    }
  });
});

// afficher questionnaire avec questions
router.get("modifier-questionnaire/:id", passport.authenticate('jwt', {session: false}), checkAdmin, function (req, res) {
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

// modifier questionnaire seulement
router.post("/modifier-questionnaire/:id", passport.authenticate('jwt', { session: false }), checkAdmin, function (req, res) {
  Questionnaire.findOneAndUpdate({_id: req.params.id}, {$set: {
    titre         : req.body.titre,
    etablissement : req.body.etablissement,
    site          : req.body.site,
    commentaire   : req.body.commentaire
  }}, function (error, questionnaire) {
    if (error) {
      res.status(500).json(error_msg: error);
    } else {
      res.status(200).json(success_msg: "success");
    }
  })
});

// Ajouter question au questionnaire
router.post("/ajouter-question/:id", passport.authenticate('jwt', {sessions: false}), checkAdmin, function (req, res) {
  Question.create({
    questionnaireID : req.params.id,
    contenu         : req.params.id
  }, function (error, question) {
    if (error) res.status(500).json({error_msg: error});
    else {
      res.status(200).json({success_msg: "Question crée"});
    }
  });
});

/*
// modifier question
router.post("/modifier-question/:id", passport.authenticate('jwt', { session: false }), checkAdmin, function (req, res) {
  Question.findOneAndUpdate({_id: req.params.id}, {$set:{
    contenu
  }})
});
*/

// supprimer question

router.delete("/supprimer-question/:id", passport.authenticate('jwt', {session: false}), checkAdmin, function (req, res) {
  Question.deleteOne({_id: req.params.id}, function (errors) {
    if (error) res.status(500).json({error_msg: error});
    else {
      res.status(200).json({success_msg: "Question supprimée"});
    }
  });
});








module.exports = router;
