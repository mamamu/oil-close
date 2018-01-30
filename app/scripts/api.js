
const yelp = require('yelp-fusion');
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.SECRET; 
var client;

module.exports={
  gettoken:function(req, res, next){
    
    if (client==undefined){
      yelp.accessToken(clientId, clientSecret).then(response => {        
      client = yelp.client(response.jsonBody.access_token);
      next();
      });
    } else {      
      next();
    }
  },
  searchapi:function(req, res, next){
    var offset=0
    if (req.query.offset!==undefined){
      offset=req.query.offset;
    }    
    const searchRequest = {
      offset: offset,
      term:'bar',
      location: req.query.location,
      latitude: req.query.lat,
      longitude: req.query.long,      
    };

  
  client.search(searchRequest).then(response => { 
    
    req.bizlist=response.jsonBody.businesses;
    next();
}).catch(e => {
  console.log(e);
});

}
}

