const React = require('react');
const PlanVisit = require('./PlanVisit')


const VenueList = function( {objectArray, userLoggedIn}   ) {  
  return (      
    <div>
      <ul>
        {objectArray.map(function(item, i) {
        return <div className="ListItem" key={item.id}>{item.name} <PlanVisit id={item.id} userLoggedIn={userLoggedIn} /></div>;
      })}
      </ul>
      
    </div>
  );
}

;


module.exports = VenueList;