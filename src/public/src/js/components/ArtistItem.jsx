import React from "react"

import {History} from "react-router"

export default React.createClass({
	mixins: [ History ],
	render() {
		let {artist} = this.props;

		return (
			<div className="artist" onClick={this._gotoArtist.bind(this)}>
				<div className="cover">
					{(artist.images.length && artist.images[0].url)?
						(<img className="cover" src={artist.images[0].url} />)
						:(<img className="cover" src="http://i2.wp.com/www.back2gaming.com/wp-content/gallery/tt-esports-shockspin/white_label.gif" />)
					}
				</div>
				<div className="artist-name">
					{artist.name}
				</div>
			</div>
		)
	},
	_gotoArtist() {
		let artistId = this.props.artist.spotifyId || this.props.artist.id;
		this.history.pushState(null, "/app/music/artists/" + artistId);
	}
});