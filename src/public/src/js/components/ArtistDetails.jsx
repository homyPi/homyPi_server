import React from "react";
import ArtistStore from '../stores/ArtistStore.jsx';
import ArtistActions from '../actions/ArtistActionCreators.jsx';

import Track from "./Track.jsx";
import AlbumItem from "./AlbumItem.jsx";
import Io from "../io.jsx";

export default React.createClass({
	_onChange() {
		this.setState({
			artist: ArtistStore.getAll().artist
		});
	},
	getInitialState() {
	  	ArtistActions.getArtist(this.props.params.artistId);
	  	return {
			artist: ArtistStore.getAll()
		}
	},
  	componentDidMount() {
	  	ArtistStore.addChangeListener(this._onChange);
  	},
  	componentWillUnmount() {
    	ArtistStore.removeChangeListener(this._onChange);
  	},

	render() {
		let {artist} = this.state;
		return (
			<div>
				<h2>{artist.name}</h2>
				{(artist.top_tracks)?
				  			artist.top_tracks.map(result =>
					          <Track key={result.id} track={result} playTrack={this._playTrack} addTrack={this._addTrackInPlaylist}/>
				            ): null
				        }
				<br />
				<div className="album-list">
				  	{(artist.albums)?
				  			artist.albums.map(result =>
				  				(result.album_type === "album")?
					          		<AlbumItem key={result.id} album={result} playAlbum={this._playAlbum}/>
					          		:null
				            ): null
				        }
				</div>
			</div>
		)
	},
	_playAlbum (album) {
		console.log("play", album);
		Io.socket.emit("player:play:album", {id: album.id}); 
	},
	_playTrack(track) {
		Io.socket.emit("player:play:track", {"source": "spotify", "uri": track.uri});
	},
	_addTrackInPlaylist(track) {
		Io.socket.emit("player:playlist:add", {"track": {"uri": track.uri, "source": "spotify"}});
	},

});