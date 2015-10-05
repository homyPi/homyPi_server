import React from "react";
import MyArtistsStore from '../stores/MyArtistsStore.jsx';
import MyArtistsActions from '../actions/MyArtistsActionCreators.jsx';
import ArtistItem from "./ArtistItem.jsx";

class MyArtists extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			artists: MyArtistsStore.getAll().artists
		};
	}
	_onChange(artists) {
		this.setState({artists: MyArtistsStore.getAll().artists});
	}

	componentDidMount() {
		MyArtistsStore.addChangeListener(this._onChange.bind(this));
		MyArtistsActions.getAll();
	}

  	componentWillUnmount() {
    	MyArtistsStore.removeChangeListener(this._onChange);
  	}

  	render() {
  		let {artists} = this.state;
  		return (
  			<div className="artist-list">
  	 			{(artists)?
		  			artists.map(result =>
			        <ArtistItem key={result.id} artist={result} playAlbum={this._playAlbum}/>
		            ): null
		        }
		    </div>
		)
  	}

}
MyArtists.defaultProps = {};

export default MyArtists;