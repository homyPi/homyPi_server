import React from 'react';
import {RaisedButton, TextField, Paper, Snackbar} from 'material-ui';
import UserAPI from '../apis/UserAPI.jsx';

let styles = {
	container: {
		paddingTop: "15px",
		paddingLeft: "15px",
		paddingRight: "15px",
		paddingBottom: "15px"
	},
	passwordForm: {
		display: "flex",
		"flexDirection": "column"
	},
	submitButton: {
		width: "100px"
	}
};

class MyAccount extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
			oldPassword: "",
			newPassword: "",
			confirmNewPassword: ""
		};
  	}
	_onChangePassword() {
		let {oldPassword, newPassword, confirmNewPassword} = this.state;
		UserAPI.updatePassword(oldPassword, newPassword, confirmNewPassword)
			.then(function() {
				this.refs.passwordSnackbar.show();	
			}.bind(this));
	}
	_setOldPassword(event) {
		this.setState({oldPassword: event.target.value});
	}
	_setNewPassword(event) {
		this.setState({newPassword: event.target.value});
	}
	_setConfirmNewPassword(event) {
		this.setState({confirmNewPassword: event.target.value});
	}
	render() {
		let {oldPassword, newPassword, confirmNewPassword} = this.state;
		return (
			<Paper style={styles.container}>
				<h1>My account</h1>
				<h3>Edit my password</h3>
				<form style={styles.passwordForm}>
					<TextField
  						hintText="Old password"
  						defaultValue={oldPassword}
  						ref="oldPassword" 
  						onChange={this._setOldPassword.bind(this)}
  						type="password" />
					<TextField
  						hintText="New password"
  						defaultValue=""
  						onChange={this._setNewPassword.bind(this)}
  						type="password" />
					<TextField
  						hintText="Comfirm new password"
  						defaultValue=""
  						onChange={this._setConfirmNewPassword.bind(this)}
  						type="password" />
  					<RaisedButton
  						style={styles.submitButton}
  						primary={true}
  						label="Save"
  						disabled={!oldPassword || !newPassword || (newPassword !== confirmNewPassword)}
  						onClick={this._onChangePassword.bind(this)}
  						type="submit" />
				</form>	
				<Snackbar
		            ref="passwordSnackbar"
		            message="Password changed"
		            autoHideDuration={3000}/>
			</Paper>
		)
	}
}

MyAccount.defaultProps = {

}

export default MyAccount;