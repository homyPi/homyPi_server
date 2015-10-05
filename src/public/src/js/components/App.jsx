import React, {PropTypes} from 'react';
import {Link, Navigation} from 'react-router';
import UserAPI from "../apis/UserAPI.jsx"

import AppHeader from './AppHeader.jsx'
import Player from './Player.jsx';
import Io from "../io.jsx";


export default React.createClass({
   mixins : [Navigation],
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
        <Player/>
      </div>
    );
  }
});
