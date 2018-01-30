const React = require('react');
const axios = require('axios');
const HeadCount = require('./HeadCount')


class PlanVisit extends React.Component {
  constructor(props){    
    super(props);     
    this.id=this.props.id;
    this.count=this.props.count
    this.userLoggedIn=this.props.userLoggedIn
    this.handleClick = this.handleClick.bind(this); 
    this.state={ going: false, headcount: 0, appt_time: null }
  }
  
  componentDidMount() {
    //get initial is user going data from database and set state
    if (this.userLoggedIn===true){
      axios.get('/userGoing', {params:{
        id: this.id}})
      .then((response)=>{  
          if (typeof(response.data)==="boolean"){
            this.setState({going:response.data})
          } else {
            alert(response.data.error);
            window.location.reload();  
          }
        }).catch(function(error){
      })
    }
  
    //get the initial headcount data and set state
    axios.get('/headcount',{params:{
      id: this.id}})
    .then((response)=>{      
        this.setState({headcount:response.data.headcount})
      }).catch(function(error){
      });   
  }
  
  componentWillUnmount(){
    
  }
  
   handleClick(e) {      
    e.preventDefault();  
    
    //when this sends the request it is sending with the old state.  ie if you are chaging from going=false to going=true, going is
     //false right here, if you're deciding not to go, going=true.  seems easiest to effect db based on state as is and then update state
     //when response comes back OK, which helps deal with any async page/state update issuse.
    axios.get('/going', {params:{
      id: this.id,
      going: this.state.going,
      appt_time: this.state.appt_time
    }
    })
    .then((response)=> {    
      //right here, you'll get a date (string) if the db insert/delete OK or an error message (object) if the person needs to log in.
      if (typeof response.data!=="string"){  
        alert(response.data.error)
        window.location.reload();      
      }    

     this.setState (
        {going: !this.state.going,
         appt_time: response.data       
        })
      axios.get('/headcount',{params:{
        id: this.id}})
      .then((response)=>{      
          this.setState({headcount:response.data.headcount})
        }).catch(function(error){
        })
      })  
      .catch(function (error) {
        console.log(error);
      }); 
  }
  
  
render(){
  //something to look at here when theres time.  on ff and chrome on the computer, buttons work fine, but on phone button which has been 
  //classed "ButtonSelected" turns yellow, but does not turn back to grey when "NotSelected", even though text changes.  
  //button does turn back to grey once a new event happens--it appears that this has to do with class not updating right on mobile.
  var userisLoggedIn=(this.props.userLoggedIn===true);
  
  
  var buttontext="Going!";
  var buttonClass="disabled";
 
  if (!userisLoggedIn){
    buttonClass="disabled";
  } else if (userisLoggedIn&&this.state.going===false){
    buttontext="Go";
    buttonClass="not-selected";
  } else if (userisLoggedIn&&this.state.going===true) {
    buttonClass="selected";
  }
  
  return(
  <div className='right' key={this.props.id} >  <HeadCount id={this.props.id} headcount={this.state.headcount} count={this.props.count} />
      <button className={buttonClass} onClick={this.handleClick}>{buttontext}</button>  </div>
  )
}
  
}

module.exports = PlanVisit