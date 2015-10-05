import Dispatcher from '../Dispatcher';
import Constants from '../Constants';
import ArtistAPI from '../apis/ArtistAPI.jsx';

export default {
	getAll() {
		ArtistAPI.getMyArtists()
			.then(function(results) {
				Dispatcher.handleViewAction({
			        type: Constants.ActionTypes.SET_MY_ARTISTS,
			      	artists: results
			    });
			})
			.catch(function(err) {
				
			});
	}
}