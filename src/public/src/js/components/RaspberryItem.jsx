import React from 'react';
import {RaisedButton, Paper} from 'material-ui';
import UserAPI from '../apis/UserAPI.jsx';

let styles = {
	container: {
		paddingTop: "15px",
		paddingLeft: "15px",
		paddingRight: "15px",
		paddingBottom: "15px",
		display:"flex",
		"flexDirection": "row"
	},
	leftBlock: {
		display:"flex",
		"flexDirection": "row",
		flex: 1,
		"alignItems": "center"
	},
	rightBlock: {
		display:"flex",
		"flexDirection": "row",
		"alignItems": "center",
		"justifyContent": "space-around",
		flex: 0.5
	},
	enabled: {
		color: "#55ee55",
		fontSize: "22px"
	},
	disabled: {
		color: "#e90000",
		fontSize: "22px"
	}
};

class RaspberryItem extends React.Component {
	constructor(props) {
	    super(props);
  	}

  	_getStatus() {
  		let {state} = this.props.raspberry;
  		if (state === "UP") {
  			return (
				<div style={styles.enabled}>
						ON
				</div>
  			);
  		} else {
  			return (
				<div style={styles.disabled}>
					OFF
				</div>
  			);
  		}
  	}

	render() {
		let {name} = this.props.raspberry;
		return (
			<Paper style={styles.container}>
				<div style={styles.leftBlock}>
					{name}
				</div>
				<div style={styles.rightBlock}>
					{this._getStatus()}
					<RaisedButton
				  		title="Details"
				  		primary={false} />

				</div>
			</Paper>
		)
	}
}

RaspberryItem.defaultProps = {
	raspberry: {}
}

export default RaspberryItem;