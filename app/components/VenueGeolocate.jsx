const React = require('react');
const axios = require('axios');
const Link = require('react-router-dom').Link
const VenueList = require('./VenueList')


class VenueGeolocate extends React.Component {
  constructor(props){    
    super(props);
    this.handleClick = this.handleClick.bind(this);  
    //this.handleLocationChange=this.handleLocationChange.bind(this);
    this.state={ data: [], location: "" }
  } 
  
componentDidMount() {  
  this.position = navigator.geolocation.getCurrentPosition(
    (position)=>{
      this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                
    
      })
    
  axios.get('/search', {params:{
    lat: position.coords.latitude,
    long: position.coords.longitude
  }
  })
  .then((response)=> {
     this.setState({
                data: response.data,    
      })
    console.log(response.data);
  })
  //    .then(function (response) {
    //console.log(response.data);
  //})
  .catch(function (error) {
    console.log(error);
  });
  
      })
  
  }

  componentWillUnmount() {

  }
  
  updateLocation(e){
    this.setState({      
      location: e.target.value      
    });
  }
  
  handleClick(e) {           
    e.preventDefault(); 
      axios.get('/search', {params:{
    location: this.state.location
  }
  })
  .then((response)=> {
     this.setState({
                data: response.data,    
      })    
  })  
  .catch(function (error) {
    console.log(error);
  });
   
  }
  
 
  
  render(){
    const hasCoords = (this.state.latitude!==undefined)
    const location = this.state.location==="";
    
    
    return(
      <div> 
        <form>
        <label>Enter location:</label>
          <input value={this.state.location} onChange={e => this.updateLocation(e)}></input>
          <button type="submit" name="submit" onClick={this.handleClick}>Submit</button>
        </form>
           
        <p>you are searching:
          { //conditional display for user accepted geolocation and has coords in state and location equals empty string (this erases coord data once you start typing as state updates at once)
          hasCoords!==false &&  location &&
            <span>Latitude {this.state.latitude}, Longitude {this.state.longitude} </span> 
          } </p>
        
        <p>{this.state.location}</p>
        <Link to='/login'>Login Here</Link>
        <VenueList objectArray={this.state.data} />
      </div>
    )
  }
}



module.exports = VenueGeolocate;