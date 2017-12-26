const React = require('react');
const Link = require('react-router-dom').Link

const LoginPage = function() {
  
  return (      
    <div>
      <h1>this is a stub for a login page </h1>      
      <Link to='/'>Go Back to Main Page</Link>
    </div>
  );
}

module.exports = LoginPage;