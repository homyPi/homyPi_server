import React from 'react';
import { Router, Route, DefaultRoute} from 'react-router';
import {AppCanvas, RaisedButton, Styles} from 'material-ui';
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

const ThemeManager = new Styles.ThemeManager();

import Home from './Home.jsx';
import App from './App.jsx';
import UserAPI from "../apis/UserAPI.jsx";
import Login from './Login.jsx';
import KitchenSink from './KitchenSink.jsx';
import MusicSearch from './SearchMusic.jsx';
import Music from './Music.jsx';
import ArtistDetails from "./ArtistDetails.jsx";
import MyArtists from "./MyArtists.jsx";

function requireAuth(nextState, redirectTo) {
  if (!UserAPI.getToken()) {
    redirectTo('/login', '/login', {});
  }
}
export default React.createClass({
	propTypes: {},

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },
  render() {
    return (
      <Router>
      <Route path="/" component={Home}/>
	    <Route path="/app" component={App} onEnter={requireAuth}>
      		<Route name="kitchenSink" path="sink" component={KitchenSink} />
          <Route path="music" component={Music}>
            <Route name="searchMusic" path="search(/:search)" component={MusicSearch} />
            <Route name="my-artists" path="artists/me" component={MyArtists} />
            <Route name="artists" path="artists/:artistId" component={ArtistDetails} />
          </Route>
	    </Route>
      <Route name="login" path="/login" component={Login} />
	  </Router>
    );
  }
});
