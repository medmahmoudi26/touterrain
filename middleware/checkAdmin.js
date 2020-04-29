module.exports = {
  checkAdmin: function (req,res,next) {
    if (req.user.estAdmin) {
      return next()
    } else {
      res.status(403).json({error_msg: "You are not admin"});
    }
  }
}
