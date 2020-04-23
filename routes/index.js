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

router.get('/Utilisateurs', passport.authenticate('jwt', {session: false}), function (req, res) {
  User.find({}, function (err, users) {
    if (err) res.status(500).json({error_msg: 'Internal Error'});
    else {
      res.status(200).json(users);
    }
  })
});

module.exports = router;
