import React from 'react';
import {History} from "react-router"

export default React.createClass({
	mixins: [ History ],
	render() {
		let {track, isPlaying, playTrack, addTrack, removeTrack, nowPlaying} = this.props;
		let actions = [];
		let classes = "track";
		if (playTrack) {
			actions.push(<i onClick={playTrack.bind(null,track)} className="material-icons">play_arrow</i>);
		}
		if (addTrack) {
			actions.push(<i onClick={addTrack.bind(null,track)} className="material-icons">playlist_add</i>);
		}
		if (removeTrack) {
			actions.push(<i onClick={removeTrack.bind(null,track)}  className="material-icons">delete</i>);
		}
		if (isPlaying) {
			classes += " playing";
		}
		return (
			<div className={classes}>
				<div className="playing">

				</div>
				<div className="name">
					{track.name}
				</div>
				<div className="artists">
					{(track.artists)?
						track.artists.map(function(artist) {
						return <a onClick={this._gotoArtist.bind(this, artist.id)}>{artist.name}</a>
					}.bind(this)):null}
				</div>
				<span className="actions">
					{actions.map(function(action) {
						return action;
					})}
				</span>
			</div>
		)
	},
	_gotoArtist(id) {
		this.history.pushState(null, "/app/music/artists/" + id);
	}

});