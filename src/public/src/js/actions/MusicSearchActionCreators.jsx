import Dispatcher from '../Dispatcher';
import Constants from '../Constants';
import MusicSearchAPI from '../apis/MusicSearchAPI.jsx';

export default {
	search(query) {
		MusicSearchAPI.search(query)
			.then(function(results) {
				Dispatcher.handleViewAction({
			        type: Constants.MusicSearchActionTypes.SET_RESULTS,
			      	results: results
			    });
			})
			.catch(function(err) {
				
			});
	}
}