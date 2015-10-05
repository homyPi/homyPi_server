import React from 'react';

class AlbumItem extends React.Component {
	
	render() {
		let {album, playAlbum} = this.props;
		return (
			<div className="album">
				<div className="cover">
					<img className="cover" src={album.images[0].url} />
					<div className="play-album" onClick={playAlbum.bind(null, album)}>
						<span className="play"></span>
						<i className="material-icons play">play_arrow</i>
					</div>
				</div>
				<div className="album-name">
					{album.name}
				</div>
			</div>
		)
	}

}
AlbumItem.defaultProps = {
	album: {
		images: [{url: ""}],
		name: "untitled"
	}
};
export default AlbumItem;