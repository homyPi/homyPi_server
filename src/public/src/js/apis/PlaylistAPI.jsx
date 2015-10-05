import $ from 'jquery'
import Io from "../io.jsx"
import UserAPI from "../apis/UserAPI.jsx"

import config from "../config.js"
var serverUrl = config.server_url || "";

function setHeaders(xhr) {
    xhr.setRequestHeader ("Authorization", "Bearer " + UserAPI.getToken());
}

export default {

	loadPlaylist() {
		return new Promise((resolve, reject) => {
			$.ajax({
					url: serverUrl + "/api/playlists/",
					type: "GET",
					beforeSend: setHeaders,
					success: function(resp) {
						console.log(resp);
						resolve(resp.playlist);
					},
					fail: function(err) {
						reject(err)
					}
				});
		});
	}
};