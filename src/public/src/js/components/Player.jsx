import React from 'react';
import {AppCanvas, RaisedButton, DropDownMenu} from 'material-ui';
import RaspberryStore from '../stores/RaspberryStore.jsx';
import PlaylistStore from '../stores/PlaylistStore.jsx';
import PlaylistActionCreators from '../actions/PlaylistActionCreators.jsx';
import RaspberryActionCreators from '../actions/RaspberryActionCreators.jsx';
import PlayerActions from './PlayerActions.jsx';
import Playlist from './Playlist.jsx';
import PlayerProgress from './PlayerProgress.jsx'

import Io from "../io.jsx"

export default React.createClass({
	getProgressInterval: null,
	autoUpdateProgress: null,
	_onRaspberryChange() {
	    this.setState({
	      raspberries: RaspberryStore.getAll().raspberries,
	      selectedRaspberry : RaspberryStore.getAll().selectedRaspberry,
			tracks: PlaylistStore.getAll().tracks
	    });
	    this.setGetTrackProgressInterval();
	},
	_onPlaylistChange() {
		this.setState({
			playing: PlaylistStore.getAll().playing,
			tracks: PlaylistStore.getAll().tracks,
			progress: PlaylistStore.getAll().progress
		});
		this.setGetTrackProgressInterval();
	},
	getInitialState() {
	   	RaspberryActionCreators.getAll();
	   	PlaylistActionCreators.loadPlaylist();
	    return {
	      raspberries: RaspberryStore.getAll().raspberries,
	      selectedRaspberry : RaspberryStore.getAll().selectedRaspberry,
	      playing: PlaylistStore.getAll().playing,
	      tracks: PlaylistStore.getAll().tracks,
	      progress: PlaylistStore.getAll().progress,
	      extended: false
	    };
	},
	componentDidMount() {
	    RaspberryStore.addChangeListener(this._onRaspberryChange);
	    PlaylistStore.addChangeListener(this._onPlaylistChange);
	    Io.socket.on("raspberry:new", function(data) {
	    	RaspberryActionCreators.newRaspberry(data.raspberry);
	    });
	    Io.socket.on("raspberry:remove", function(data) {
	    	RaspberryActionCreators.removeRaspberry(data.socketId);
	    });
	    Io.socket.on("player:status:updated", function(data) {
	    	RaspberryActionCreators.updateState(data.socketId, data.status);
	    });
	    Io.socket.on("playlist:track:added", function(data) {
	    	if (data.track) {
				PlaylistActionCreators.addTrack(data.track);
	    	} else if (data.trackset) {
	    		PlaylistActionCreators.addTrackset(data.trackset);
	    	}
		});
		Io.socket.on("playlist:track:removed", function(data) {
			PlaylistActionCreators.removeTrack(data._id);
		});
		Io.socket.on("playlist:track:clear", function(track) {
			PlaylistActionCreators.clear();
		});
		Io.socket.on("playlist:playing:id", function(data) {
			PlaylistActionCreators.updatePlayingId(data.idPlaying);
		});
		Io.socket.on("playlist:track:progress", function(data) {
			PlaylistActionCreators.updateProgress(data.trackOffset_ms);
		});
		this.setGetTrackProgressInterval();
	},
	componentWillUnmount() {
	    RaspberryStore.removeChangeListener(this._onRaspberryChange);
	    PlaylistStore.removeChangeListener(this._onPlaylistChange);
	    if (this.getProgressInterval) {
			clearInterval(this.getProgressInterval);				this.getProgressInterval = null;
		}
		if (this.autoUpdateProgress) {
			clearInterval(this.autoUpdateProgress)
			this.autoUpdateProgress = null;
		}
	},
	render() {
		let {raspberries, selectedRaspberry, playing, tracks, progress} = this.state;
		let playerClassName  = "player";
		if(this.state.extended) {
			playerClassName += " extended";
		}
		return (
			<div className={playerClassName} style={(selectedRaspberry)? {display:"block"}:{display:"none"}} onClick={this._extend}>
				<div className="player-body">
					<div className="player-header">
						{(selectedRaspberry)? <PlayerActions raspberry={selectedRaspberry}/>:<div></div>}
						{(playing)? 
							<div className="playing-track">
								<div className="track-info">
									<img className="cover" src={playing.album.images[0].url} />
									<div className="info">
										<span className="track-name">{playing.name}</span>
										<span className="artist">{playing.artists.map(function(artist) { return (artist.name + "; ")})}</span>
									</div>
								</div>
								<div className="track-progress">
									<PlayerProgress value={progress.progressMs} min={0}  max={playing.durationMs} onSeekTrack={this._seek}/>
									<span className="time">{progress.minutes}:{progress.seconds}/{playing.durationStr}</span>
								</div>
								
						</div>: null}
					</div>
	        		<Playlist playing={playing} tracks={tracks} play={this._playTrack} removeTrack={this._removeTrack}/>
	        		<br />
	        		<RaisedButton label="Generate a random playlist" onClick={this._generateRandomPlaylist}/>
        		</div>
			</div>
		);
	},
	setGetTrackProgressInterval() {
		if (this.state.selectedRaspberry && this.state.selectedRaspberry.status === "PLAYING") {
			if (!this.getProgressInterval) {
				Io.socket.emit("playlist:track:progress:get");
				this.getProgressInterval = setInterval(function(){
					Io.socket.emit("playlist:track:progress:get");
				}, 5000);
			}
			if (!this.autoUpdateProgress) {
				this.autoUpdateProgress = setInterval(function() {
					var ms = this.state.progress.progressMs + 1000;
					PlaylistActionCreators.updateProgress(ms);
				}.bind(this), 1000)
			}
		} else {
			if (this.getProgressInterval) {
				clearInterval(this.getProgressInterval);
				this.getProgressInterval = null;
			}
			if (this.autoUpdateProgress) {
				clearInterval(this.autoUpdateProgress)
				this.autoUpdateProgress = null;
			}
		}
	},
	_setSelectedRaspberry(e, selectedIndex, menuItem) {
		RaspberryActionCreators.setSelectedRaspberry(menuItem);
	},
	_seek(value, event) {
		event.preventDefault();
		event.stopPropagation();
		Io.socket.emit("player:seek", {progress_ms: value});
		PlaylistActionCreators.updateProgress(value);
	},
	_playTrack(track) {

	},
	_generateRandomPlaylist(event) {
		event.preventDefault();
		event.stopPropagation();
		Io.socket.emit("player:play:generated", {nbTracks: 5})
	},
	_removeTrack(track) {
		Io.socket.emit("player:playlist:remove", {_id: track._id});
	},
	_extend() {
		this.setState({
			extended: !this.state.extended
		})
	}
})