import $ from "jquery";
import Io from '../io.jsx'

import config from "../config.js";
var serverUrl = config.server_url || "";
var token = null;

var setToken = function(newToken) {
	token = newToken;
    localStorage.setItem('token', token);
}

var getToken = function() {
	if (token) {
		return token;
	} else {
		token = localStorage.getItem('token');
		Io.connect(token);
		return token;
	}
};
var setHeaders = function(xhr) {
	xhr.setRequestHeader ("Authorization", "Bearer " + getToken());
}

export default {
	getToken: getToken,
	token: token,
	login(username, password) {
		return new Promise(function(resolve, reject) {
			$.ajax({
					url: serverUrl + "/api/users/login",
					type: "POST",
				    data: JSON.stringify({ username: username, password: password }),
				    contentType: "application/json; charset=utf-8",
				    dataType: "json",
					success: function(resp) {
						if (resp.error) {
							return reject(resp);
						} else {
							setToken(resp.token);
							return resolve(resp.token);
						}
					},
					fail: function(err) {
						reject(err)
					}
				});
			});
	},
	updatePassword(old, newPassword, confirm)  {
		return new Promise(function(resolve, reject) {
			$.ajax({
				url: serverUrl + "/api/users/me/password",
				type: "POST",
			    data: JSON.stringify({ 
			    	oldPassword: old,
			    	newPassword: newPassword,
			    	confirmNewPassword: confirm 
			    }),
			    beforeSend: setHeaders,
				contentType: "application/json; charset=utf-8",
			    dataType: "json",
				success: function(resp) {
					console.log(resp);
					if (resp.error) {
						return reject(resp);
					} else {
						console.log(resp)
						return resolve(resp);
					}
				},
				fail: function(err) {
					reject(err)
				}
			});
		});
	}
};