import $ from 'jquery'
import UserAPI from "../apis/UserAPI.jsx"
function setHeaders(xhr) {
    xhr.setRequestHeader ("Authorization", "Bearer " + UserAPI.getToken());
}

export default {
	getAll() {
		return new Promise((resolve, reject) => {
			$.ajax({
					url: "http://localhost:3000/api/raspberries/",
					type: "GET",
					beforeSend: setHeaders,
					success: function(resp) {
						resolve(resp.raspberries);
					},
					fail: function(err) {
						reject(err)
					}
				});
		});
	}
};