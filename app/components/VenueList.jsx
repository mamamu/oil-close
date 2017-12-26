const React = require('react');
const PlanVisit = require('./PlanVisit')


const VenueList = function( {objectArray} ) {
  return (      
    <div>
      <ul>
        {objectArray.map(function(item, i) {
        return <li key={item.id}>{item.name + " - "+item.headcount} <PlanVisit id={item.id} /></li>;
      })}
      </ul>
      
    </div>
  );
}

module.exports = VenueList;