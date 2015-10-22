import React, {PropTypes} from 'react';
import {Link, History} from 'react-router';
import UserAPI from "../apis/UserAPI.jsx";

import ModuleManager from '../ModuleManager.jsx';

import AppHeader from './AppHeader.jsx'
//import Player from './Player.jsx';
import Io from "../io.jsx";
window.io = Io;


export default React.createClass({
  mixins : [History],
  statics: {
	willTransitionTo: function(nextState, redirectTo) {
	  	if (!UserAPI.getToken()) {
	  		redirectTo("/login");
	  	}
	  }
	},
  render() {
  	let defaultPage = (
  		<div className="home">
	  		<h1>HomyPy</h1>
	  		<Link to="/app/sink">sink</Link>
  		</div>
  		)

    return (
      <div>
        <AppHeader />
        <div id="body">
          {
            this.props.children || defaultPage
          }
        </div>
        <div>
          { 
            ModuleManager.getFooter()
          }
        </div>
      </div>
    );
  }
});
