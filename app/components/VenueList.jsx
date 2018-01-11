const React = require('react');
const PlanVisit = require('./PlanVisit')


const VenueList = function( {objectArray, userLoggedIn, updateArray}   ) { 
  
  objectArray.forEach(function(venue){
    for (var i=0; i<updateArray.length; i++){
            if (updateArray[i].id==venue.id){
              venue.count=updateArray[i].count
            }
    }
  })
  
  return (      
    <div className="main">
      <ul>
        {objectArray.map(function(item, i) { 
          return <div className="ListItem" key={item.id}> <span className="Name">{item.name} </span>   <PlanVisit id={item.id} userLoggedIn={userLoggedIn} count={item.count} /> </div>;
      })}
      </ul>
      
   </div> 
  );
}

;


module.exports = VenueList;