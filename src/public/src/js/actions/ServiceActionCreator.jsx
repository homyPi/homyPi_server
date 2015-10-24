import Dispatcher from '../Dispatcher';
import Constants from '../Constants';
import ServiceAPI from '../apis/ServiceAPI.jsx';

export default {
	getAll(username, password) {
		ServiceAPI.getAll()
			.then(function(services) {
				Dispatcher.handleViewAction({
			        type: Constants.ServiceActionTypes.SET_LIST,
			        services: services
      			});
			})
			.catch(function(err) {

			});
	}
}