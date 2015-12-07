import React from 'react';
import {AppBar, Avatar, LeftNav, IconMenu, MenuItem} from "material-ui";
let HeaderMenuItem = require("material-ui/lib/menus/menu-item");
import ModuleManager from "../ModuleManager.jsx";

import RaspberryActionCreators from "../actions/RaspberryActionCreators.jsx";
import RaspberryStore from "../stores/RaspberryStore.jsx";

var capFirst = function(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

var getRaspberryAvatar = function(rasp) {
	if (!rasp) {
		return "";
	}
	if (rasp.name) {
		return rasp.name.charAt(0).toUpperCase();
	}
	return "U";
}

class AppHeader extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	raspberries: RaspberryStore.getAll().raspberries,
	    	selectedRaspberry: RaspberryStore.getAll().selectedRaspberry
	    };
		this._onRaspberriesChange = () => {
			console.log("MENU HEADER raspberries changed");
			this.setState({
				raspberries: RaspberryStore.getAll().raspberries,
				selectedRaspberry: RaspberryStore.getAll().selectedRaspberry
			});
		}
	}
	componentDidMount() {
		RaspberryActionCreators.getAll();
		RaspberryStore.addChangeListener(this._onRaspberriesChange);
	}
	componentWillUnmount() {
		RaspberryStore.removeChangeListener(this._onRaspberriesChange);
	}
	render() {
			console.log("MENU HEADER render");
		let menuItems = [];
		ModuleManager.modules.forEach(function(m) {
			if (m.config.menu && m.config.menu.length) {
				if(m.config.name) {
					menuItems.push({ type: MenuItem.Types.SUBHEADER, text: capFirst(m.config.name) })
				}
				menuItems = menuItems.concat(m.config.menu);
			}
		});
		menuItems = menuItems.concat(
			[
				{ type: MenuItem.Types.SUBHEADER, text: 'Settings' },
				{ route: '/app/users/me', text: 'My account' },
				{ route: '/app/services', text: 'Services' },
				{ route: '/app/settings/raspberries', text: 'Raspberries' }
			]
			);
		ModuleManager.modules.forEach(function(m) {
			if (m.config.settingsRoute) {
				menuItems.push(m.config.settingsRoute);
			}
		});
		console.log("MENU HEADER state:", this.state);
		return (
			<div>
				<AppBar
				  title="HomyPi"
				  onLeftIconButtonTouchTap={() => {this._showLeftNav()}}
				  iconElementRight={
				    <IconMenu iconButtonElement={
				      <Avatar>{
				      	getRaspberryAvatar(this.state.selectedRaspberry)
				      }</Avatar>
				    }>
				    {this.state.raspberries.map((rasp) => {
				    	return (
				    		<HeaderMenuItem 
				    			key={rasp.id} 
				    			disabled={(rasp.state !== "UP")}
				    			primaryText={rasp.name} 
				    			onClick={()=> {this._selectedPi(rasp)}} />
				    		);
				    })}  
				     </IconMenu>
				} />
			  	<LeftNav ref="leftNav" docked={false} menuItems={menuItems} onChange={this._onLeftNavChange.bind(this)} />
			</div>
		)
	}

	_selectedPi(pi) {
		RaspberryActionCreators.setSelectedRaspberry(pi);
	}

	_showLeftNav() {
		this.refs.leftNav.toggle();
	}
	_onLeftNavChange(e, key, payload) {
	  this.context.history.pushState(null, payload.route, {});
	}

}
AppHeader.defaultProps = {}
AppHeader.contextTypes = {
  history: React.PropTypes.object
};
export default AppHeader;

/*
<div id="header">
			<div className="avata-selector">
				<Avatar 
				backgroundColor="#e9e9e9"
				src="http://i.imgur.com/qC2eT.png" />
			</div>
			</div>
			*/