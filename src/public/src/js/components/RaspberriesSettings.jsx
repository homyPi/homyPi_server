import React from 'react';
import {RaisedButton, TextField, Paper, Dialog} from 'material-ui';
import UserAPI from '../apis/UserAPI.jsx';
import RaspberryItem from "./RaspberryItem.jsx";

import RaspberryActionCreators from "../actions/RaspberryActionCreators.jsx";
import RaspberryStore from "../stores/RaspberryStore.jsx";

let styles = {
	container: {
		paddingTop: "15px",
		paddingLeft: "15px",
		paddingRight: "15px",
		paddingBottom: "15px"
	}
};

class RaspberriesSettings extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
			raspberries: RaspberryStore.getAll().raspberries
		};
  	}
  	_onRaspberriesChange() {
  		this.setState({raspberries: RaspberryStore.getAll().raspberries})
  	}
	componentWillMount() {
		RaspberryActionCreators.getAll();
		RaspberryStore.addChangeListener(() => { this._onRaspberriesChange() });
	}
	render() {
		let {raspberries} = this.state;

		let standardActions = [
		  { text: 'Cancel' },
		  { text: 'Add', onTouchTap: this._onDialogSubmit }
		];
		return (
			<Paper style={styles.container}>
				<h2>Raspberries</h2>
				{raspberries.map(function(raspberry) {
					return (<RaspberryItem raspberry={raspberry}/>)
				})}
				<br/>
				<RaisedButton
  					style={styles.submitButton}
  					onClick={() => this._showAddRaspberryModal()}
  					primary={true}
  					label="Add" />

				<Dialog
				  title="Add a new raspberry"
				  actions={standardActions}
				  open={this.state.showModal}
				  onRequestClose={this._handleRequestClose}>
				  	<form>
				  		<input value="name"/>
				  	</form>
				</Dialog>
			</Paper>
		)
	}

	_showAddRaspberryModal() {
		this.setState({showModal: true});
	}

	_onDialogSubmit() {
		this.setState({showModal: false});
	}
}

RaspberriesSettings.defaultProps = {

}

export default RaspberriesSettings;