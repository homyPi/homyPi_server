import React, {PropTypes} from 'react';
import {AppCanvas, FontIcon, RaisedButton, DropDownMenu} from 'material-ui';

import Io from "../io.jsx"

export default React.createClass({
	resume(event) {
		event.preventDefault();
		event.stopPropagation();
		Io.socket.emit("player:resume");
	},
	pause(event) {
		event.preventDefault();
		event.stopPropagation();
		Io.socket.emit("player:pause");
	},
	previous(event) {
		event.preventDefault();
		event.stopPropagation();
		Io.socket.emit("player:previous");
	},
	next(event) {
		event.preventDefault();
		event.stopPropagation();
		Io.socket.emit("player:next");
	},
	render() {
		let {raspberry} = this.props;
		let statusAction = null;
		if (raspberry.status === "PLAYING") {
			statusAction = (<i onClick={this.pause} className="material-icons pause-icon">pause_arrow</i>)
		} else if (raspberry.status === "PAUSED") {
			statusAction = (<i onClick={this.resume} className="material-icons play-icon">play_arrow</i>)
		}
		return (
			<div className="player-actions">
				<i onClick={this.previous} className="material-icons previous-icon">skip_previous</i>
				{statusAction}
				<i onClick={this.next} className="material-icons next-icon">skip_next</i>
			</div>
		);
	}
})