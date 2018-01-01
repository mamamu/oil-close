const React = require('react');
const axios = require('axios');

class HeadCount extends React.Component {
  constructor(props){    
    super(props); 
    this.id=this.props.id;
    this.headcount=this.props.headcount
    //this.handleClick = this.handleClick.bind(this); 
    //this.state={ headcount: 0 }
  }
  
  componentDidMount() { 
    
  }
  
  componentWillUnmount(){
  }
  
  render(){
 
  
  return(
  <span className='headcountcontainer' key={this.props.id} ><span className='headcount' > {this.props.headcount} are going   </span>  </span>
  )
}
  
}

module.exports = HeadCount