const React = require('react');
const axios = require('axios');
const HeadCount = require('./HeadCount')


class PlanVisit extends React.Component {
  constructor(props){    
    super(props);     
    this.id=this.props.id;
    this.userLoggedIn=this.props.userLoggedIn
    this.handleClick = this.handleClick.bind(this); 
    this.state={ going: false, headcount: 0, appt_time: null }
  }
  
  componentDidMount() {
    //get initial is user going data from database and set state
    axios.get('/userGoing', {params:{
    id: this.id}})
  .then((response)=>{
      //console.log(response.data)
      this.setState({going:response.data})
    }).catch(function(error){
    })
    
    //get headcount for this, pass it in props to the headcount component
    //currently updating this on a two minute cycle
    axios.get('/headcount',{params:{
    id: this.id}})
  .then((response)=>{
      //console.log(response)
      this.setState({headcount:response.data.headcount})
    }).catch(function(error){
    });
    //update approx 2 minutes  stopgap solution.  some kind of server push would be better I think.
        this.timerID = setInterval(
      () => axios.get('/headcount',{params:{
    id: this.id}})
  .then((response)=>{
      //console.log(response)
      this.setState({headcount:response.data.headcount})
    }).catch(function(error){
    }),
      120000
    );

    
    
    
  }
  componentWillUnmount(){
    clearInterval(this.timerID);
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
      console.log(response.data)
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
    
  
     
     /*
 axios.get()
  .then((response)=>{
    }).catch(function(error){
    })
  */ 
  }
render(){
  var userisLoggedIn=(this.props.userLoggedIn===true);
  
  var buttontext="Going!";
  var buttonClass="Disabled";
  
  if (this.state.going===false){
    buttontext="Go Here";
    buttonClass="Normal";
  }
  if (!userisLoggedIn){
    buttonClass="Disabled";
  } else if (userisLoggedIn&&this.state.going===false){
    buttontext="Go Here";
    buttonClass="Normal";
  } else {
    buttonClass="ButtonSelected";
  }
  
  return(
  <div className='right' key={this.props.id} >  <HeadCount id={this.props.id} headcount={this.state.headcount} />
      <button className={buttonClass} onClick={this.handleClick}>{buttontext}</button>  </div>
  )
}
  
}

module.exports = PlanVisit