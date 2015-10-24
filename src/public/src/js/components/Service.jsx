import React from 'react';
import {RaisedButton} from 'material-ui';

let styles = {
	container: {
		display: "flex",
		"flexDirection": "row",
		"alignItems": "center",
		"width": "90%",
		"height": "50px"
	},
	accountStatus: {
		"display": "flex",
		"flexDirection": "row",
		"alignItems": "center",
		"width": "60%"
	},
	serviceName: {
		"fontSize": "16px",
		"width": "20%",
		"marginBottom": "0px"
	},
	accountInfo: {
		"fontSize": "14px",
		"width": "60%",
		"marginBottom": "0px"
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
					(service.isLoggedIn) ? this.getLoggedIn() : this.getNotLoggedIn()
				}
			</div>
		)
	}

});