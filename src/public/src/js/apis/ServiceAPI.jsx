import $ from 'jquery'
import UserAPI from "../apis/UserAPI.jsx"

import config from "../config.js"
var serverUrl = config.server_url || "";

function setHeaders(xhr) {
    xhr.setRequestHeader ("Authorization", "Bearer " + UserAPI.getToken());
}

export default {
	getAll() {
		return new Promise((resolve, reject) => {
			$.ajax({
					url: serverUrl + "/api/services",
					type: "GET",
					beforeSend: setHeaders,
					success: function(resp) {
						resolve(resp);
					},
					fail: function(err) {
						reject(err)
					}
				});
		});
	}
};