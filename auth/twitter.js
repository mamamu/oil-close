module.exports = function(passport, db) {
  
  var Strategy = require('passport-twitter').Strategy,
      path = '/login/twitter',
      returnPath = path + '/return';
  
 
  passport.use(new Strategy({
      consumerKey: process.env.TWITTER_KEY,
      consumerSecret: process.env.TWITTER_SECRET,
      callbackURL: 'https://'+process.env.PROJECT_DOMAIN+'.glitch.me' + returnPath,      
      includeEmail: false,      
      includeStatus: false,
      includeEntities: false
    },
    function(token, tokenSecret, profile, cb) {      
      db.findOrCreate(profile, function (err, user) {
        return cb(err, user);
      });
    }));

  return {
    routes: function(app) {
      
      app.get(path,
        passport.authenticate('twitter'));
      
      app.get(returnPath, 
        passport.authenticate('twitter', { failureRedirect: '/login' }),
        function(req, res) {
          res.redirect('/');
        });
    }
  };
};