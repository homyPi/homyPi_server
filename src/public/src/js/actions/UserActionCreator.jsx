import Dispatcher from '../Dispatcher';
import Constants from '../Constants';
import UserAPI from '../apis/UserAPI.jsx';

export default {
	login(username, password) {
		UserAPI.login(username, password)
			.then(function(token) {
				Dispatcher.handleViewAction({
			        type: Constants.UserActionTypes.LOGIN_SUCCESS,
			        token: token
      			});
			})
			.catch(function(err) {

			});
	}
}