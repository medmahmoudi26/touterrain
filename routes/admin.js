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


module.exports = router;
