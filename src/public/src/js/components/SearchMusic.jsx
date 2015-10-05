import React, {PropTypes} from 'react';
import {TextField, RaisedButton, Tabs, Tab} from 'material-ui';
import MusicSearchStore from '../stores/MusicSearchStore.jsx';
import MusicSearchActions from '../actions/MusicSearchActionCreators.jsx';
import Track from "./Track.jsx";
import AlbumItem from "./AlbumItem.jsx";
import ArtistItem from "./ArtistItem.jsx";
import Io from "../io.jsx";
import {History} from "react-router"

export default React.createClass({
	mixins: [ History ],
	_onChange() {
	    this.setState({
	      tracks: MusicSearchStore.getAll().tracks,
	      albums: MusicSearchStore.getAll().albums,
	      artists: MusicSearchStore.getAll().artists
	    });
    },
	  getInitialState() {
	  	let search = "";
	  	if (this.props.params && this.props.params.search) {
			search = this.props.params.search;
		}
	    return {
	      tracks: MusicSearchStore.getAll().tracks,
	      albums: MusicSearchStore.getAll().albums,
	      artists: MusicSearchStore.getAll().artists,
	      search: search,
	      searchType: "track"
	    };
	  },
  	componentDidMount() {
	  	MusicSearchStore.addChangeListener(this._onChange);
    	if (this.state.search != "") {
	    	this._handleSearch();
	    }
  	},
  	componentWillUnmount() {
    	MusicSearchStore.removeChangeListener(this._onChange);
  	},

	render() {
		let {tracks, albums, artists} = this.state;
		return (
			<div id="search">
				<form className="search-form">
					<TextField
						className="search-input"
		  				value={this.state.search}
		  				onChange={this._handleSearchChange}/>
		  			<RaisedButton 
						className="search-button"
						type="submit"
						label="Search" onClick={this._handleSearch}/>
				</form>
				<Tabs>
					<Tab label="Tracks"
						onActive={this._setSeachType.bind(this, "track")}>
			  			
			  			{(tracks.items)?
				  			tracks.items.map(result =>
					          <Track key={result.id} track={result} playTrack={this._playTrack} addTrack={this._addTrackInPlaylist}/>
				            ): null
				        }
					</Tab>

  					<Tab label="Albums" 
  						onActive={this._setSeachType.bind(this, "album")}>
						<div className="album-list">
				  			{(albums.items)?
					  			albums.items.map(result =>
						          <AlbumItem key={result.id} album={result} playAlbum={this._playAlbum}/>
					            ): null
					        }
				        </div>
					</Tab>
  					<Tab label="Artists" 
  						onActive={this._setSeachType.bind(this, "artists")}>
						<div className="artist-list">
				  			{(artists.items)?
					  			artists.items.map(result =>
						          <ArtistItem key={result.id} artist={result} playAlbum={this._playAlbum}/>
					            ): null
					        }
				        </div>
					</Tab>
				</Tabs>
			</div>
		);
	},
	_setSeachType(type) {
		this.setState({searchType: type});
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
	_handleSearchChange(event) {
		this.setState({search: event.target.value});
	},
	_handleSearch() {
		let search =this.state.search;
		this.history.pushState(null, "/app/music/search/" + search);
		MusicSearchActions.search(this.state.search);
	}
});