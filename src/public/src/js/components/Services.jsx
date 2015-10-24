import React from 'react';
import Service from './Service.jsx';

import ServiceStore from '../stores/ServiceStore.jsx';
import ServiceActionCreators from '../actions/ServiceActionCreator.jsx';


let styles = {
	list: {
		display: "flex",
		"flexDirection": "column"
	}
}

export default React.createClass({
	_onServicesChange: function() {
		this.setState({services: ServiceStore.getAll().services});
	},
	getInitialState: function() {
		ServiceActionCreators.getAll();
		return {
			services: ServiceStore.getAll().services
		}
	},
	componentDidMount: function() {
	    ServiceStore.addChangeListener(this._onServicesChange);
	},
	render: function() {
		let {services} = this.state;
		return (
			<div style={styles.list}>
				{
					services.map(function(service) {
						return (<Service key={service.name} service={service} />);
					})
				}
			</div>
		)
	}

});