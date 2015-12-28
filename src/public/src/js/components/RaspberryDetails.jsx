import React from 'react';
import {RaisedButton, TextField, Paper, Dialog} from 'material-ui';
import UserAPI from '../apis/UserAPI.jsx';
import ModuleItem from "./ModuleItem.jsx";

import RaspberryActionCreators from "../actions/RaspberryActionCreators.jsx";
import RaspberryStore from "../stores/RaspberryStore.jsx";

let styles = {
	container: {
		paddingTop: "15px",
		paddingLeft: "15px",
		paddingRight: "15px",
		paddingBottom: "15px"
	},
	up: {
		color: "#55ee55",
		fontSize: "22px"
	},
	down: {
		color: "#e90000",
		fontSize: "22px"
	}

};

class RaspberriesSettings extends React.Component {
	constructor(props) {
	    super(props);
	    var rasp = RaspberryStore.getRaspberry(this.props.params.name)
	    this.state = {
	    	raspberry: rasp || {modules:[]}
	    }
	    this._onRaspberriesChange = () => {
			var rasp = RaspberryStore.getRaspberry(this.props.params.name)
		    this.setState({
		    	raspberry: rasp || {modules:[]}
		    });
	  	}
  	}
	componentDidMount() {
		RaspberryActionCreators.get(this.props.params.name);
		RaspberryStore.addChangeListener(this._onRaspberriesChange);
	}
	componentWillUnmount() {
		RaspberryStore.removeChangeListener(this._onRaspberriesChange);
	}
	render() {
		let {raspberry} = this.state;
		return (
			<div>
				<Paper style={styles.container}>
					<h2>{raspberry.name}</h2>
					{raspberry.modules.map(function(module) {
						return (
							<ModuleItem module={module}/>
						);
					}.bind(this))}
					
				</Paper>

				<Paper style={styles.container}>
					<h2>Info</h2>
					IP address: {raspberry.ip}
				</Paper>
			</div>
		)
	}
	_getStateView(module) {
		if (module.state === "UP") {
			return (<div style={styles.up}>UP</div>);
		} else {
			return (<div style={styles.down}>DOWN</div>);
		}
	}
}

RaspberriesSettings.defaultProps = {
	params: {
		name: ""
	}
}

export default RaspberriesSettings;