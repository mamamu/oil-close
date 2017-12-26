const React = require('react');
const axios = require('axios');

class PlanVisit extends React.Component {
  constructor(props){    
    super(props); 
    this.id=this.props.id;
    this.handleClick = this.handleClick.bind(this); 
    this.state={ going: false }
  }
  
  componentDidMount() { 
  }
  
  componentWillUnmount(){
  }
  
   handleClick(e) {           
    e.preventDefault();      
     console.log(this.id)
    this.setState ({
    going: !this.state.going
  })
     /*
  })*/
  axios.get('/test', {params:{
    id: this.id,
    going: this.state.going
  }
  })
  .then((response)=> {
      console.log(response)
      
     //this.setState({
              //  headcount: response.headcount,    
      //})   
      
  })  
  .catch(function (error) {
    console.log(error);
  });
   
  }
render(){
  var buttontext="You're Going!";
  if (this.state.going===false){
    buttontext="Go Here"}
  
  return(
  <div><span>headcount here key={this.props.id} <button onClick={this.handleClick}>{buttontext}</button>  </span></div>
  )
}
  
}

module.exports = PlanVisit