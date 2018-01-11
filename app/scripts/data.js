module.exports={
  checkall:function (req, res, next){
    //initial weed of the api data (need id, name, coords? link?) 
    var appts = [
  {user:1, id:'brink-brewing-cincinnati', created_at:1512314160891},
      {user:3, id:'brink-brewing-cincinnati', created_at:1512314160891}
];
    //working to check entire list if thats the way I go.
    req.array.forEach(function(item){
      var id=item.id;
      item.headcount=0;
      
      /*
      appts.forEach(function(appt){ 
        
      if (appt.id===id){
        //console.log(id)
        item.headcount+=1;
      } else {
        item.headcount+=0;
      }
      */
    //})
   
  })
   next();
                        
  

                        }}
