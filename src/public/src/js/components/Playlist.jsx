import React, {PropTypes} from 'react';
import {AppCanvas, RaisedButton, Styles} from 'material-ui';
import Track from "./Track.jsx";
import Io from "../io.jsx"

export default React.createClass({
	render() {
		let {tracks, playing, play, removeTrack} = this.props;
		
		return (
			<div className="playlist">
				<h1>Playlist</h1>
				{tracks.map(track =>
		          <Track key={track._id} track={track} playTrack={play} removeTrack={removeTrack} isPlaying={(playing && playing._id == track._id)}/>
		        )}
			</div>
		);
	}
})