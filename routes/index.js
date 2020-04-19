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

// Express router
var router = express.Router();

router.get('/logoff', function (req, res) {
  req.session.destroy();
  req.logout();
  res.redirect('/');
});

router.post('/connexion', function (req, res) {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({error_msg: "Vous devez taper votre email et mot de passe"});
  }

  User.findOne({email: req.body.email}, function (err, user) {
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
});

router.post('/creer_compte', function (req, res) {
  console.log(req.body);
  if (!req.body.email || !req.body.password) {
    res.status(400).json({error_msg: "Vous devez taper votre email et mot de passe"})
  }
  User.findOne({email: req.body.email}, function (err, exist) {
    if (err) {
      res.status(400).json({error: err});
      console.log(err);
    }
    else if (exist) {
      res.status(400).json({error_msg: 'Email déja enregistré'})
    } else {
      var hashedpass = bcrypt.hashSync(req.body.password, 10);
      User.create({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        password: req.body.hashedpass,
        poste: req.body.poste,
        estAdmin: false
      }, function (error, user) {
        if (error) res.status(400).json({error_msg: error});
        else {
          res.status(201).json({user: user});
        }
      });
    }
  });
});

router.get('/profile', passport.authenticate('jwt', { session: false }), function (req, res) {
  res.json({success_msg: "User logged in"})
});

router.get('/Utilisateurs', passport.authenticate('jwt', {session: false}), function (req, res) {
  User.find({}, function (err, users) {
    if (err) res.status(500).json({error_msg: 'Internal Error'});
    else {
      res.status(200).send(users);
    }
  })
});

module.exports = router;
