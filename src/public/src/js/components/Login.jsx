import React from 'react';
import {Paper, TextField, RaisedButton} from 'material-ui';
import UserAPI from "../apis/UserAPI.jsx";


export default React.createClass({
  getInitialState: function() {
      return {
          username: "",
          password: ""
      };
  },
  render() {
    let {username, password} = this.state;
    return (
      <div className="login">
      <Paper zDepth={2}>
        <h1>Login</h1>
        <form>
          <TextField
            hintText="Username"
            value={username}
            onChange={this._handleUsernameChange}/>
          <br />
          <TextField
            hintText="Password"
            value={password}
            type="password"
            onChange={this._handlePasswordChange}/>
            <br />
          <RaisedButton label="Submit" type="submit" onClick={this._submit}/>
        </form>
      </Paper>
      </div>
    );
  },
  _submit(){
    UserAPI.login(this.state.username, this.state.password).then(function(token) {
      
    }).catch(function(error) {
      
    });
  },
  _handleUsernameChange(event) {
    this.setState({username:event.target.value});
  },
  _handlePasswordChange(event) {
    this.setState({password:event.target.value});
  }
});
