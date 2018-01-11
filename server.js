// server.js
// where your node app starts

// init project
var express = require('express');
var moment=require('moment-timezone');




var db = require('./db');
var auth = require('./auth')(db);

var yelp = require('./app/scripts/api.js');

//may not need this? try incorporating into db.
var data = require('./app/scripts/data.js');

var sse = require('./sse')




var app = express();

app.use(express.static('public'));

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));

auth.init(app);

var headToChange=[];

app.get("/login", function (req, res) { 
  //not sure I'm still using this.
  req.error="You need to login"
  res.send(req.error)
  //res.redirect('/');    
});


app.get("/", yelp.gettoken, function (req, res) {  
  if (req.error!==undefined){
    alert(req.error)
  }
  console.log(headToChange)
  //get the yelp token on first load of index and store it
  res.sendFile(__dirname + '/app/index.html');
});

app.get('/going', require('connect-ensure-login').ensureLoggedIn('/login'), function (req, res){  
  //check if current status is not going, then set appt, then back to set status on component to going (or the reverse)  
  if (headToChange===undefined){headToChange=[];}
  headToChange.push({id:req.query.id, time:new Date()});
  if (req.query.going==='false'){        
    db.setAppt(req, res);
  } else if (req.query.going==='true'){    
    db.cancelAppt(req, res);
  }  
});

app.get('/headcount', function (req, res){  
  db.headCount(req, res)
});



app.get("/headupdate", function (req, res) {    
  req.array=headToChange; 
  db.headCountUpdate(req, res); 
 }) 
  
  
  app.get("/api/head", function (req, res) { 
  //sse function to update headcount component--be aware, final sse write call is in db.index(function countUpdate)
    //right now, headupdate which is a poll called from component is commented out inside component--jic you need to undo, or want to use as backup on a longer timescale.
       
  var event = 'headcount';
  
  
    sse.writeSSEHead(req, res, function(req, res) { 
      sse.writeSSEData(req, res, event, "None", function(req, res){
        console.log("api/head before write")
        console.log(headToChange)
        req.array=headToChange;        
      
        var intervalx = setInterval(function() {           
          console.log(headToChange.length)
          if (headToChange.length>0){
          //if have something in array here we can attach it to req and then pass over to the database where we can send
            //after we've searched db and updated the array of objects with the new count
            //otherwise we'll just check again after the timeout period--timout period could be adjusted, but right now we
            //chekc every 10 seconds
          req.array=headToChange;
          console.log(req.array);
          db.countUpdate(req, res);
          }
                   
         
        }, 10000);
        
        req.connection.addListener("close", function() {
            clearInterval(intervalx);
        });
        
      });
    });
  
})


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


app.get("/search", yelp.searchapi, function (req, res) { 
  //console.log(req.bizlist)  
  res.send(req.bizlist);    
});



//function filter here for weeding array that holds recent updates  
//event (api/head)checks this every 10 secs, give a little leeway for different timers, so discard entries after 30 seconds
        var intervalx = setInterval(function() {
          
          if (headToChange!==undefined){
          if (headToChange.length>0){
          var array=headToChange;      
          var newArray=array.filter(function(obj){            
            var difference=moment(obj.time).diff(moment());            
            return difference>=-30000
      })
          headToChange=newArray;
      
          }}
      },30000)
        
        //might not need this either
        function getHeadArray(req, res, next){
          headToChange=req.array;
          next()
        }


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
