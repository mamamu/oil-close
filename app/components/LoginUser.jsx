const React = require('react');
const Link = require('react-router-dom').Link
const axios = require('axios');

const VenueGeolocate = require('./VenueGeolocate')

class LoginUser extends React.Component {
  constructor(props){    
    super(props);    
    this.handleClick = this.handleClick.bind(this);
    this.state={ userLoggedIn: false }
  }
  
  componentDidMount() { 
    
  axios.get('/user')
    .then((response)=> {      
      var userinfo=response.data;
       this.setState ({
          userLoggedIn: userinfo.isLoggedIn,
          username: userinfo.username
          })
    })  
    .catch(function (error) {
      console.error(error);
    });
  }
  
  componentWillUnmount(){
  }
  
  handleClick(e){
    //when we logout we also want to clear the localStorage to get rid of any location settings
    localStorage.clear();  
  }
    
  render(){ 
    return ( 
      <div>
      <div>
        <span className='login'>
          {this.state.userLoggedIn===false &&
            <span>
              <span className='loginlink'><a href="/login/google">Login with Google</a></span>
              <span className='loginlink'><a href="/login/twitter">Login with Twitter</a></span>
            </span>}
          {this.state.userLoggedIn===true &&
            <span>
              <span className='usermessage'>Hello {this.state.username}!</span><span className='loginlink right'><a onClick={this.handleClick} href='/logout'>Logout</a></span>
            </span>
        }
        </span>

      </div>
      <VenueGeolocate userLoggedIn={this.state.userLoggedIn} />
      </div>
    );
  }
}

module.exports = LoginUser;