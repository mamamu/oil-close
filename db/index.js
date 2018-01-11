var mongodb=require('mongodb');
var mongoose=require('mongoose');
var Schema = mongoose.Schema; 
var Promise = require('bluebird'); 
Promise.promisifyAll(mongoose);
var url="mongodb://"+process.env.USER+":"+process.env.PASS+"@"+process.env.HOST+":"+process.env.DB_PORT+"/"+process.env.NAME;

var moment=require('moment-timezone');

var options={useMongoClient:true}

mongoose.connect(url, options);
var db=mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var sse = require('../sse')
var User=require('./models/User.js');
var Appt=require('./models/Appt.js');


module.exports = 
  {
  findById: function(id, cb) {    
    process.nextTick(function() {    
    User.findOne({'_id': id}, function(err, user){
      if (err) {cb(new Error('User ' + id + ' does not exist'));}
      if (user){
      return cb(null,user);
      }
    });
  });
},
  findOrCreate: function(profile, cb) {
    //console.log(profile)
  process.nextTick(function () {
    User.findOne({ 'profile_id': profile.id }, function(err, user){
      if (err){
        //console.log("error searching db")
        return cb(err);
      }
      if (user) {
        return cb(null, user);
      } else {
        var newUser = new User();
          newUser.user_id = new mongoose.Types.ObjectId(),
        	newUser.profile_id = profile.id;        
					newUser.username = profile.displayName;        
					newUser.provider = profile.provider;					

					newUser.save(function (err) {
						if (err) {
              console.log('save error');
							throw err;
						}
            return cb(null, newUser);        
      });
    }
  });   
});
},
  setAppt: function(req, res){
    var newAppt = new Appt();
      newAppt.venue_id = req.query.id;
      newAppt.user_id = req.user;
  
      newAppt.save(function(err){
        if (err){
          console.log('appt err');
          throw err;
        }
        res.send(newAppt.created_at);
      })
  },
  cancelAppt: function(req, res){
    var midnight=moment().startOf('day');
    var breakfast=midnight.subtract(10, 'hours');
    //console.log(req.user._id);
    Appt.findOne({user_id:req.user._id, venue_id:req.query.id, created_at:{$gt: breakfast}}, function(err, record){
      if (err){console.log(err)}       
      record.remove();
      res.send("deleted")
    })
    //user:req.user, venue_id:req.query.id, created_at:req.query.created_at
    
  },
  //current cut off is universal and based on gmt  ()
  headCount: function(req, res){    
    var midnight=moment().startOf('day');
    var breakfast=midnight.subtract(10, 'hours');    
    Appt.count({venue_id:req.query.id, created_at: {$gt: breakfast}}, function(err, count){
      if (err){console.log(err)}
      //console.log(count)      
      res.send({headcount: count})
    })
  },
    headCountUpdate: function(req, res, next){
      //first check if theres anything to update, otherwise just status 200
      if (req.array!==undefined){
      if (req.array.length>0){
        var array=req.array;      
        var retArr=[];
        var midnight=moment().startOf('day');
        var breakfast=midnight.subtract(10, 'hours')
       
        array.forEach(function(venue){       
          var retObj={}
          retObj.id=venue.id;      
          var Promise=Appt.count({venue_id:venue.id, created_at: {$gt: breakfast}}).exec()
          Promise.then(function(count){ 
            retObj.count=count;        
            retArr.push(retObj);
            if (retArr.length===array.length)  { 
              res.send(retArr);        
            }
          }).catch(function(err){
            console.error(err)
          }) 
        })
      } 
      }
    else {  
      
      res.sendStatus(200)
      }
  },
  countUpdate: function(req, res){
    //any records that have been changed are passed in the req.array from the server where there's a running list of the last 
      //first check if theres anything to update, then check db for each to update count and save array w/updated count
    //then continue the sseWriteData that started over on the server
    var event = 'headcount';
    console.log(req.array)
      if (req.array!==undefined){
      if (req.array.length>0){
        var array=req.array;      
        var retArr=[];
        var midnight=moment().startOf('day');
        var breakfast=midnight.subtract(10, 'hours')
       
        array.forEach(function(venue){       
          var retObj={}
          retObj.id=venue.id;      
          var Promise=Appt.count({venue_id:venue.id, created_at: {$gt: breakfast}}).exec()
          Promise.then(function(count){ 
            retObj.count=count;        
            retArr.push(retObj);
            if (retArr.length===array.length)  { 
              //req.retArr(retArr); 
              var data=retArr      
              sse.writeSSEData(req, res, event, data)
              //return retArr;
            }
          }).catch(function(err){
            console.error(err)
          }) 
        })
      } 
      }
    else {  
      //next()
      console.log("no data")
      //res.sendStatus(200)
      }
  },
  writeCountUpdate: function(req, res){
      //first check if theres anything to update, otherwise just status 200
    var event = 'headcount';
  
  
    //sse.writeSSEHead(req, res, function(req, res) { 
      //sse.writeSSEData(req, res, event, "None", function(req, res) {
        var intervalx = setInterval(function() { 
          //console.log("inside")
          //console.log(headToChange)
          //if have something in array here, can we search db (promise) .then sse.writeData?
          //can we pass sse/use sse in db/index? and send from there?
          //req.array=headToChange;
          //console.log(req.array);
          
          //db.writeCountUpdate(req, res);
            var data="data here"       
            sse.writeSSEData(req, res, event, data)            
         
        }, 10000);
        
        req.connection.addListener("close", function() {
            clearInterval(intervalx);
        });
      //});
    //});
    /*
    var event="headcount"
    if (req.array!==undefined){
      if (req.array.length>0){
        var array=req.array;      
        var retArr=[];
        var midnight=moment().startOf('day');
        var breakfast=midnight.subtract(10, 'hours')
       
        array.forEach(function(venue){       
          var retObj={}
          retObj.id=venue.id;      
          var Promise=Appt.count({venue_id:venue.id, created_at: {$gt: breakfast}}).exec()
          Promise.then(function(count){ 
            retObj.count=count;        
            retArr.push(retObj);
            if (retArr.length===array.length)  { 
              sse.writeSSEData(req, res, event, retArr)   
              
            }
          }).catch(function(err){
            console.error(err)
          }) 
        })
      } 
    }
    else {  
      console.log("no data to send")
      //res.sendStatus(200)
      }
      */
  },
  userGoingHere: function(req, res){
    var midnight=moment().startOf('day');
    var breakfast=midnight.subtract(10, 'hours')
    var Promise=Appt.find({user_id:req.user._id, venue_id:req.query.id, created_at:{$gt: breakfast}}).limit(1).exec(); 
    Promise.then(function(records){
      var goingStatus=false;
      if (records.length>0){
        goingStatus=true
      }       
      res.send(goingStatus)
    }).catch(function(err){
            console.error(err)
          })
  }
  

}