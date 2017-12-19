const React = require('react');


const VenueList = function( {objectArray} ) {
  return (      
    <div>
      <ul>
        {objectArray.map(function(item, i) {
        return <li key={i}>{item.name + " - "+item.headcount}</li>;
      })}
      </ul>
      
    </div>
  );
}

module.exports = VenueList;