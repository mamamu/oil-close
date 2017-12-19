const React = require('react');

const VenueList = require('./VenueList');
const VenueGeolocate = require('./VenueGeolocate')

//hard coded sample data to test component display before adding state
const sample = [  { id: 'tillies-lounge-cincinnati',
    name: 'Tillie\'s Lounge',
    headcount: 0 },
  { id: 'the-hamilton-cincinnati',
    name: 'The Hamilton',
    headcount: 0 },
  { id: 'second-place-cincinnati',
    name: 'Second Place', 
    headcount: 0 } ];


const HelloWorld = function() {
  
  return (      
    <div>
      
      <VenueGeolocate />
      
    </div>
  );
}

module.exports = HelloWorld;