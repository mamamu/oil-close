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
    this.state={ data: [], location: "", updateArray:[] , offset: 0}
  } 

componentDidMount() {  
  
  //this is a timer based server poll to get changes in headcount, it's superceeded by the server sent event listener at the bottom
  //of the component, but I'm keeping it in due to the sse often disconnecting and not reconnecting on Firefox.  This will at least keep the page 
  //somewhat up to date.  Belt and suspenders.
  //update every 2 mins right now
  this.timerID = setInterval( () => { 
    axios.get('/headupdate')
    .then((response)=>{      
      if (typeof(response.data)!=="string"){
          this.setState({
            updateArray: response.data,
          })
      }
    }).catch(function(error){console.log(error)})
  },120000)
  
  
  
  ///local storage checks to get most recent location
  if (localStorage.getItem('localstoragelocation')!==null){    
  axios.get('/search', {params:{
    location: localStorage.getItem('localstoragelocation'),
    offset: localStorage.getItem('localstorageoffset') 
    }
  })
  .then((response)=> {
     this.setState({
               location: localStorage.getItem('localstoragelocation'),
               offset: localStorage.getItem('localstorageoffset'),
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
    long: localStorage.getItem('longitude'),
    offset: localStorage.getItem('localstorageoffset')
  }
  })
  .then((response)=> {
     this.setState({
           latitude: localStorage.getItem('latitude'),
           longitude: localStorage.getItem('longitude'),
           offset: localStorage.getItem('localstorageoffset'),
           data: response.data,    
      })    
  })  
  .catch(function (error) {
    console.log(error);
  });    
  }
  else {    
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
    long: position.coords.longitude,
    offset: this.state.offset
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
  
  })
  
  }
  
  //server sent event stuff here
  var evtsource = new EventSource('/api/head');

  evtsource.addEventListener('headcount', (e) => {    
    var data=JSON.parse(e.data);    
    //incoming data will be an array of objects.
    if (typeof(data)!=="string"){
    this.setState({
            updateArray: data,
          })
    }
     }, false);
     
 
  }
  
  componentWillUnmount() {   
    
  }
  
  updateLocation(e){
    
    this.setState({ 
      latitude: undefined,
      longitude: undefined,
      location: e.target.value, 
      offset: 0
    });
    localStorage.removeItem('latitude');
    localStorage.removeItem('longitude');
  }
  
  handleClick(e) {           
    e.preventDefault(); 
    var text=e.target.text    
    var os=parseInt(this.state.offset)  
    
    if (text==="Next"){
       os+=20
    }
    else if (text==="Previous"){
      os-=20
    } else {
      os=0
    }
    
    this.setState({offset:os});  
    localStorage.setItem( 'localstorageoffset', os );
    if (this.state.longitude===undefined){
    localStorage.setItem( 'localstoragelocation', this.state.location );
    
      axios.get('/search', {params:{
    location: this.state.location,        
        offset: os
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
    }else {
    axios.get('/search', {params:{
    lat: this.state.latitude,
    long: this.state.longitude,
    offset: os
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
   
  }
  
 
  
  render(){
    const hasCoords = (this.state.latitude!==undefined)
    const location = this.state.location==="";
    var hrefClass=""
    if (this.state.offset===0){
      hrefClass="is-not-clickable"
    }
    
    
    
    return(
      <div >
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
        
        <VenueList objectArray={this.state.data} userLoggedIn={this.props.userLoggedIn} updateArray={this.state.updateArray} />
         <a className={hrefClass} href="#" onClick={this.handleClick}>Previous</a>   <a href="#" onClick={this.handleClick}>Next</a> 
      </div>
    )
  }
}



module.exports = VenueGeolocate;