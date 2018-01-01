const React = require('react');
const axios = require('axios');
const Link = require('react-router-dom').Link
const VenueList = require('./VenueList')


class VenueGeolocate extends React.Component {
  constructor(props){    
    super(props);
    this.userLoggedIn=this.props.userLoggedIn;
    this.handleClick = this.handleClick.bind(this);  
    //this.handleLocationChange=this.handleLocationChange.bind(this);
    this.state={ data: [], location: "" }
  } 
///local storage is working well, but need override logic for when someone uses geolocate if you want to keep that in.  
  //updating state to clear out old requests also seems appropriate here to prevent confusion.
componentDidMount() {   
  if (localStorage.getItem('localstoragelocation')!==null){    
  axios.get('/search', {params:{
    location: localStorage.getItem('localstoragelocation')
  }
  })
  .then((response)=> {
     this.setState({
               location: localStorage.getItem('localstoragelocation'),
                data: response.data,    
      })    
  })  
  .catch(function (error) {
    console.log(error);
  });
  } 
  else if (localStorage.getItem('latitude')!==null){
  axios.get('/search', {params:{
    lat: localStorage.getItem('latitude'),
    long: localStorage.getItem('longitude')
  }
  })
  .then((response)=> {
     this.setState({
           latitude: localStorage.getItem('latitude'),
           longitude: localStorage.getItem('longitude'),
           data: response.data,    
      })
    
  })  
  .catch(function (error) {
    console.log(error);
  });
    
  }
  else {
    //local storage length is 0 when page is newly loaded after logout, not sure if I need
    console.log(window.localStorage.length)
  //geolocation here for when nothing in local storage
  this.position = navigator.geolocation.getCurrentPosition(
    (position)=>{
      localStorage.setItem('latitude', position.coords.latitude);
      localStorage.setItem('longitude', position.coords.longitude);
      localStorage.removeItem('localstoragelocation');
      
      this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                location: ""
   
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
    //console.log(response.data);
  })  
  .catch(function (error) {
    console.log(error);
  });
  
      })
  
  }
}
  componentWillUnmount() {
    
  }
  
  updateLocation(e){
    this.setState({ 
      latitude: undefined,
      longitude: undefined,
      location: e.target.value      
    });
  }
  
  handleClick(e) {           
    e.preventDefault(); 
    localStorage.setItem( 'localstoragelocation', this.state.location );
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
          hasCoords &&  location &&
            <span>Latitude {this.state.latitude}, Longitude {this.state.longitude} </span> 
          } <span>{this.state.location}</span></p> 
        
        <VenueList objectArray={this.state.data} userLoggedIn={this.props.userLoggedIn} />
      </div>
    )
  }
}



module.exports = VenueGeolocate;