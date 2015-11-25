import Dispatcher from '../Dispatcher';
import Constants from '../Constants';
import RaspberryAPI from '../apis/RaspberryAPI.jsx';

export default {
	getAll() {
		RaspberryAPI.getAll()
			.then(function(list) {
				Dispatcher.handleViewAction({
			        type: Constants.RaspberryActionTypes.GET_ALL,
			        list: list
      			});
			})
			.catch(function(err) {

			});
	},
	setSelectedRaspberry(raspberry) {
		Dispatcher.handleViewAction({
			type: Constants.RaspberryActionTypes.SET_SELECTED,
			raspberry: raspberry
      	});
	},
	newRaspberry(raspberry) {
		Dispatcher.handleViewAction({
			type: Constants.RaspberryActionTypes.NEW,
			raspberry: raspberry
      	});
	},
	removeRaspberry(socketId) {
		Dispatcher.handleViewAction({
			type: Constants.RaspberryActionTypes.REMOVE,
			socketId: socketId
      	});
	},
	newModule(data) {
		Dispatcher.handleViewAction({
			type: Constants.RaspberryActionTypes.NEW_MODULE,
			data: data
      	});

	}
}