const React = require('react');
const ReactDOM = require('react-dom');
const Route = require('react-router-dom').Route;
const BrowserRouter = require('react-router-dom').BrowserRouter;
const hashHistory = require('react-router-dom').hashHistory;

/* Import Components */
const HelloWorld = require('./components/HelloWorld');
const LoginPage = require('./components/LoginPage')
const temp = require('./client');


ReactDOM.render((
  <HelloWorld />), document.getElementById('venuediv'));