// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var yelp = require('./app/scripts/api.js')
var data = require('./app/scripts/data.js')

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", yelp.gettoken, function (req, res) {
  res.sendFile(__dirname + '/app/index.html');
});

app.get('/test', function (req, res){
  console.log("in test")
  res.send("OK")
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.get("/search", yelp.searchapi, data.checkall, function (req, res) {  
  console.log(req.bizlist);
  res.send(req.bizlist);    
});

// Simple in-memory store for now
var appts = [
  {user:1, id:'brink-brewing-cincinnati', created_at:1512314160891}
];

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
