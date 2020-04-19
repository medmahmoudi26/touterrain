var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var passport = require('passport');
//configuring app
var app = express();

mongoose.connect('mongodb+srv://med:mad@cluster0-ennjh.mongodb.net/test?retryWrites=true&w=majority')

//passport configuring
app.use(passport.initialize());
var passportMiddleware = require('./middleware/passport')
passport.use(passportMiddleware);

// body parsing
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors());


// Routes
//var userRoute = require('./routes/user.js');
var indexRoute = require('./routes/index.js');

//app.use('/user', userRoute);
app.use('/', indexRoute);

app.get("/", function (req, res) {
  res.status(200).json({msg: "It works"})
});


app.listen(80);
