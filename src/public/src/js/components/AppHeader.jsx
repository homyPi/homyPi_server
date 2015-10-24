import React from 'react';
import {AppBar, LeftNav, MenuItem} from "material-ui";
import ModuleManager from "../ModuleManager.jsx";
class AppHeader extends React.Component {
	render() {
		let menuItems = [];
		ModuleManager.modules.forEach(function(m) {
			if (m.config.menu && m.config.menu.length) {
				if(m.config.name) {
					menuItems.push({ type: MenuItem.Types.SUBHEADER, text: m.config.name })
				}
				menuItems = menuItems.concat(m.config.menu);
			}
		});
		menuItems = menuItems.concat(
			[
				{ type: MenuItem.Types.SUBHEADER, text: 'Settings' },
				{ route: '/app/services', text: 'Services' }
			]
			)

		return (
			<div>
				<AppBar
				  title="HomyPi"
				  iconClassNameRight="muidocs-icon-navigation-expand-more"
				  onLeftIconButtonTouchTap={this._showLeftNav.bind(this)} />
			  	<LeftNav ref="leftNav" docked={false} menuItems={menuItems} onChange={this._onLeftNavChange.bind(this)} />
			</div>
		)
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