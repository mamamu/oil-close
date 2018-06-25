
var express = require('express');
var moment=require('moment-timezone');


var db = require('./db');
var auth = require('./auth')(db);

var yelp = require('./app/scripts/api.js');

var sse = require('./sse')




var app = express();

app.use(express.static('public'));

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));

auth.init(app);

//arrays for keeping track briefly of the stuff that has changed for headcount sse and interval 
//these are weeded at an interval by the functions at the bottom so they don't grow too big
var headToChange=[];
var headCountArr=[];

//error message for component to handle non-logged in user 
app.get("/login", function (req, res) {   
  var error={"error":"An error has occurred. You need to login again."}
  res.send(error);     
});

//index  --removed yelp token call from here as it's no longer needed 
app.get("/", function  (req, res) {    
  res.sendFile(__dirname + '/app/index.html');
});

//if users is going or not going to a venue....
app.get('/going', require('connect-ensure-login').ensureLoggedIn('/login'), function (req, res){   
  //add changes to arrays keeping track for SSE and timer headcount updates.
  if (headToChange===undefined){headToChange=[];} 
  headToChange.push({id:req.query.id, time:new Date()});  
  if (headCountArr===undefined){headCountArr=[];}
  headCountArr.push({id:req.query.id, time:new Date()})
  
   //check if current status is not going, then set appt, then back to set status on component to going (or the reverse)   
  if (req.query.going==='false'){        
    db.setAppt(req, res);
  } else if (req.query.going==='true'){    
    db.cancelAppt(req, res);
  }  
});

//sent from planvisit to get headcount for a single venue--this fires when the list on the page intially loads 
//and is additionally called by a single component onclick after db update.
app.get('/headcount', function (req, res){  
  db.headCount(req, res)
});


//array sent from timer on venueGeolocate to get updated count array
app.get("/headupdate", function (req, res) {    
  req.array=headCountArr;  
  db.headCountUpdate(req, res); 
 }) 
  
  //sse function to update headcount component--be aware, final sse write call is in db.index(function countUpdate)
  app.get("/api/head", function (req, res) {   
  var event = 'headcount';    
    sse.writeSSEHead(req, res, function(req, res) { 
      sse.writeSSEData(req, res, event, "None", function(req, res){        
        req.array=headToChange;       
      
        var intervalx = setInterval(function() {           
          console.log(headToChange.length)
          if (headToChange.length>0){
          //if have something in array here we can attach it to req and then pass over to the database where we can send
            //after we've searched db and updated the array of objects with the new count
            //otherwise we'll just check again after the timeout period--timout period could be adjusted, but right now we
            //check every 10 seconds
          req.array=headToChange;          
          db.countUpdate(req, res);
          }                  
         
        }, 10000);
        
        req.connection.addListener("close", function() {
            clearInterval(intervalx);          
        });
        
      });
    });
  
})

//initial check by id that each planvisit component uses to check begining state of whether user is going to a venue.
app.get('/usergoing', function (req, res){  
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
  res.send(req.bizlist);    
});



//function filter here for weeding array that holds recent updates for server sent event 
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
    
        //another function to filter.  this one is for the timer which checks every 2 minutes, so leave for 4
    var intervaly = setInterval(function() {
          
          if (headCountArr!==undefined){
          if (headCountArr.length>0){            
            var array=headCountArr;      
            var newArray=array.filter(function(obj){            
            var difference=moment(obj.time).diff(moment());            
            return difference>=-240000
      })
          headCountArr=newArray;
      
          }}
      },120000)
      


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
