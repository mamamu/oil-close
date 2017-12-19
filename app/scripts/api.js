
const yelp = require('yelp-fusion');
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.SECRET; 
var client;

module.exports={
  gettoken:function(req, res, next){
    
    if (client==undefined){
      yelp.accessToken(clientId, clientSecret).then(response => {
      console.log(response.jsonBody);    
      client = yelp.client(response.jsonBody.access_token);
      next();
      });
    } else {
      //console.log("still here");
      next();
    }
  },
  searchapi:function(req, res, next){
    const searchRequest = {
      term:'bar',
      location: req.query.location,
      latitude: req.query.lat,
      longitude: req.query.long,      
    };

  console.log(searchRequest);
  client.search(searchRequest).then(response => {    
    req.bizlist=response.jsonBody.businesses;
    next();
}).catch(e => {
  console.log(e);
});

}
}

