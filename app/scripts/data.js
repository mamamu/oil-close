module.exports={
  checkall:function (req, res, next){
    //initial weed of the api data (need id, name, coords? link?) 
    var appts = [
  {user:1, id:'brink-brewing-cincinnati', created_at:1512314160891},
      {user:3, id:'brink-brewing-cincinnati', created_at:1512314160891}
];
    //working to check entire list if thats the way I go.
    req.bizlist.forEach(function(biz){
      var id=biz.id;
      biz.headcount=0;
      appts.forEach(function(appt){      
      if (appt.id===id){
        //console.log(id)
        biz.headcount+=1;
      } else {
        biz.headcount+=0;
      }
    })
   
  })
   next();
                        
  

                        }}
