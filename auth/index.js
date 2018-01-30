module.exports = function (db) {
  
  var passport = require('passport');
  var google = require('./google')(passport, db);
  //var local = require('./local')(passport, db);
  var twitter = require('./twitter')(passport, db);
  require('./sessions')(passport, db);
  
  return {
    init: function(app) {
      
      // Initialize Passport and restore authentication state, if any, from the
      // session.
      app.use(passport.initialize());
      app.use(passport.session());

      google.routes(app);
      twitter.routes(app);  
      
      app.get('/logout',
        function(req, res){
          req.logout();
          res.redirect('/');
        });

    }
  };
};