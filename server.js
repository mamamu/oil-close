// server.js
// where your node app starts

// init project
var express = require('express');
var db = require('./db');
var auth = require('./auth')(db);

var yelp = require('./app/scripts/api.js');
//may not need this? try incorporating into db.
var data = require('./app/scripts/data.js');

var app = express();

app.use(express.static('public'));

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));

auth.init(app);

app.get("/login", function (req, res) {  
  console.log('do i have a login route?');
  res.sendFile(__dirname + '/app/login.html');    
});

app.get("/", yelp.gettoken, function (req, res) {
  //get the yelp token on first load of index and store it
  res.sendFile(__dirname + '/app/index.html');
});

app.get('/going', require('connect-ensure-login').ensureLoggedIn(), function (req, res){  
  //check if current status is not going, then set appt, then back to set status on component to going (or the reverse)
  if (req.query.going==='false'){
    db.setAppt(req, res)
  } else if (req.query.going==='true'){
    db.cancelAppt(req, res)
  }  
});

app.get('/headcount', function (req, res){
  db.headCount(req, res)
});

app.get('/usergoing', require('connect-ensure-login').ensureLoggedIn(), function (req, res){  
  db.userGoingHere(req, res)
});

app.get('/user', function (req, res){
  //get and send some basic user info for components
  var userinfo;
  if (req.user) {
    userinfo={isLoggedIn: true, username: req.user.username}
  }
  else {
    userinfo={isLoggedIn:false, username: ""}
  }
  res.send(userinfo)
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.get("/search", yelp.searchapi, function (req, res) { 
  //console.log(req.bizlist)
  res.send(req.bizlist);    
});






// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
