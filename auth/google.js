module.exports = function(passport, db) {  
  
  var Strategy = require('passport-google-oauth20').Strategy,
      path = '/login/google',
      returnPath = path + '/return';
  
  passport.use(new Strategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'https://'+process.env.PROJECT_DOMAIN+'.glitch.me' + returnPath,
      
    },
    function(accessToken, refreshToken, profile, cb) {    
      db.findOrCreate(profile, function (err, user) {
        return cb(err, user);
      });
    }));

  return {
    routes: function(app) {
      
      app.get(path,
        passport.authenticate('google', { scope: ['profile', 'email'] }));
      
      app.get(returnPath, 
        passport.authenticate('google', { failureRedirect: '/' }),
        function(req, res) {
          res.redirect('/');
        });
    }
  };
};