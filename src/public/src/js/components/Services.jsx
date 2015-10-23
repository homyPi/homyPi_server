import React from 'react';
import Service from './Service.jsx';


let styles = {
	list: {
		display: "flex",
		"flex-direction": "column"
	}
}

export default React.createClass({

	render: function() {
		let servicesTests = [
	{
		name: "spotify",
		loggedIn: true,
		user: "some.mail@thing.com"
	},
	{
		name: "another",
		loggedIn: false,
	}
];
		return (
			<div style={styles.list}>
				{
					servicesTests.map(function(service) {
						return (<Service key={service.name} service={service} />);
					})
				}
			</div>
		)
	}

});