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
    //console.log(req.user._id);
    Appt.findOne({user_id:req.user._id, venue_id:req.query.id, created_at:req.query.appt_time}, function(err, record){
      if (err){console.log(err)} 
      //console.log(record);
      record.remove();
      res.send("deleted")
    })
    //user:req.user, venue_id:req.query.id, created_at:req.query.created_at
    
  },
  //need to refine this so it only counts appts in the past day
  headCount: function(req, res){
    //console.log(req.query)
    //timezone  difference may break?? 
    var midnight=moment().startOf('day');
    var breakfast=midnight.subtract(10, 'hours')
    console.log(breakfast);
    Appt.count({venue_id:req.query.id, created_at: {$gt: breakfast}}, function(err, count){
      if (err){console.log(err)}
      //console.log(count)
      res.send({headcount: count})
    })
  },
  userGoingHere: function(req, res){
    var midnight=moment().startOf('day');
    var breakfast=midnight.subtract(10, 'hours')
    var Promise=Appt.find({user_id:req.user._id, venue_id:req.query.id, created_at:{$gt: breakfast}}).limit(1).exec(); 
    Promise.then(function(rec){
      console.log(rec);
       var goingStatus=false;
      if (rec.length>0){
        goingStatus=true
      }
       
      res.send(goingStatus)
    }
     )
  }
  

}