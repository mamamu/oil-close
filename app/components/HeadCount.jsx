const React = require('react');
const axios = require('axios');

class HeadCount extends React.Component {
  constructor(props){    
    super(props); 
    this.id=this.props.id;
    this.headcount=this.props.headcount
    this.count=this.props.count
    
  }
  
  componentDidMount() { 
    
   
    
  }
  
  componentWillUnmount(){
  }
  
  render(){
    
 var hasChanged=(this.props.count>0)
 
  
  return(
    <span className='headcountcontainer' key={this.props.id} ><span className='headcount' >{hasChanged && this.props.count}  {!hasChanged && this.props.headcount} <img src="https://res.cloudinary.com/db8ctqbcb/image/upload/v1515447459/icon_chsxxb.jpg" width="25px" />   </span>  </span>
  )
}
  
}

module.exports = HeadCount