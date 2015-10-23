import React from 'react';
import { Router, Route, DefaultRoute} from 'react-router';
import {AppCanvas, RaisedButton, Styles} from 'material-ui';
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();
const theme = require('./theme');
const ThemeManager = Styles.ThemeManager;

import Home from './Home.jsx';
import App from './App.jsx';
import UserAPI from "../apis/UserAPI.jsx";
window.UserAPI = UserAPI;
import Login from './Login.jsx';
import Services from './Services.jsx';
import ModuleManager from '../ModuleManager.jsx';

function requireAuth(nextState, redirectTo) {
  if (!UserAPI.getToken()) {
    redirectTo('/login', '/login', {});
  }
}


export default React.createClass({
	propTypes: {
    muiTheme: React.PropTypes.object
  },
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(theme)
    };
  },
  render() {
    let modules = ModuleManager.modules;
    return (
      <Router>
      <Route path="/" component={Home}/>
	    <Route path="/app" component={App} onEnter={requireAuth}>
      		<Route name="services" path="services" component={Services} />
          {modules.map(function(module) {return module.config.routes})}
	    </Route>
      <Route name="login" path="/login" component={Login} />
	  </Router>
    );
  }
});
