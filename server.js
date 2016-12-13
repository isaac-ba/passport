var express = require('express');
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var expressSession = require('express-session');

app.use(express.static(__dirname));

app.use(expressSession({secret: 'mySecretKey'}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());

passport.serializeUser(function (user, done) {
  console.log(user);
  done(null, user.myID);
});

passport.use('login', new LocalStrategy(function (username, password, done) {
  var authenticated = username === "John" && password === "Smith";
  
  if (authenticated) {
    return done(null, { myUser:'user', myID: 1234 });
  } else {
    return done(null, false);       
  }
}));

app.post('/login', passport.authenticate('login', {
  successRedirect: '/success',
  failureRedirect: '/login'
}));

app.get('/success', function (req, res){
  res.send("Hey, hello from the server!");
})

app.get('/login', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.listen(8000);