import $ from 'jquery'
import UserAPI from "../apis/UserAPI.jsx"
function setHeaders(xhr) {
    xhr.setRequestHeader ("Authorization", "Bearer " + UserAPI.getToken());
}

export default {
	getArtist(id) {
		return new Promise((resolve, reject) => {
			$.ajax({
					url: "http://localhost:3000/api/spotify/artists/" + id,
					type: "GET",
					beforeSend: setHeaders,
					success: function(resp) {
						resolve(resp.artist);
					},
					fail: function(err) {
						reject(err)
					}
				});
		});
	},
	getMyArtists() {
		return new Promise((resolve, reject) => {
			$.ajax({
					url: "http://localhost:3000/api/users/me/artists?limit=25",
					type: "GET",
					beforeSend: setHeaders,
					success: function(resp) {
						resolve(resp.artists);
					},
					fail: function(err) {
						reject(err)
					}
				});
		});
	}
};