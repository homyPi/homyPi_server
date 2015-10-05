import $ from 'jquery'
import Io from "../io.jsx"
import UserAPI from "../apis/UserAPI.jsx"
function setHeaders(xhr) {
    xhr.setRequestHeader ("Authorization", "Bearer " + UserAPI.getToken());
}

export default {

	loadPlaylist() {
		return new Promise((resolve, reject) => {
			$.ajax({
					url: "http://localhost:3000/api/playlists/",
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