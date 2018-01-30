module.exports = function(passport, db) {

  passport.serializeUser(function(user, cb) {
    
    cb(null, user._id);
  });
  
  passport.deserializeUser(function(_id, cb) {    
    db.findById(_id, function (err, user) {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });
  
  return passport;
};