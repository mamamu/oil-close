
const yelp = require('yelp-fusion');
//const clientId = process.env.CLIENT_ID;
//const clientSecret = process.env.SECRET; 
const apiKey = process.env.YELP_API;
var client = yelp.client(apiKey);

module.exports={
  //no longer need clientId and call to get a token--now yelp is doing api keys
  
  //gettoken:function(req, res, next){
    
    //if (client==undefined){
      //new--yelp now has api keys and we don't need to get an access token
      //yelp.accessToken(clientId, clientSecret).then(response => {          
      //lient = yelp.client(response.jsonBody.access_token);
      //client = yelp.client(apiKey);
      //next();
      
    //} else {      
      //next();
    //}
  //},
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

