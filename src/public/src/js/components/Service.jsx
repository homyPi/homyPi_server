import React from 'react';
import {RaisedButton} from 'material-ui';

let styles = {
	container: {
		display: "flex",
		"flex-direction": "row",
		"align-items": "center",
		"width": "90%"
	},
	accountStatus: {
		"display": "flex",
		"flex-direction": "row",
		"align-items": "center",
		"width": "60%"
	},
	serviceName: {
		"font-size": "16px",
		"width": "20%"
	},
	accountInfo: {
		"font-size": "14px",
		"width": "60%"
	}
}
export default React.createClass({
	getLoggedIn: function() {
		let {service} = this.props;
		return (
			<div style={styles.accountStatus}>
				<p style={styles.accountInfo} >Logged in as {service.user}</p>
				<RaisedButton label="Log out" />
			</div>
		)
	},
	getNotLoggedIn: function() {
		let {service} = this.props;
		return (
			<div style={styles.accountStatus}>
				<RaisedButton secondary={true} label="Log in" />
			</div>
		)
	},
	render: function() {
		let {service} = this.props;
		return (
			<div style={styles.container}>
				<p style={styles.serviceName}>
					{service.name}
				</p>
				{
					(service.loggedIn) ? this.getLoggedIn() : this.getNotLoggedIn()
				}
			</div>
		)
	}

});