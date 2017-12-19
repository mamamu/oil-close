module.exports={
  checkall:function (req, res, next){
    //initial weed of the api data (need id, name, coords?) 
    var appts = [
  {user:1, id:'brink-brewing-cincinnati', created_at:1512314160891},
      {user:3, id:'brink-brewing-cincinnati', created_at:1512314160891}
];
    req.bizlist.forEach(function(biz){
      var id=biz.id;
      
      //query appts count  add this number as biz.count 
      //below test succeeds in altering json sent to page remove when db wired and successfully sending.
      if (id == appts[0].id){
        biz.headcount=2;
      } else {
        biz.headcount=0;
      }
    })
    next();
  }
  

  
}

