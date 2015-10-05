import $ from "jquery"
import UserAPI from "../apis/UserAPI.jsx"
function setHeaders(xhr) {
    xhr.setRequestHeader ("Authorization", "Bearer " + UserAPI.getToken());
}

export default {
	search(request, type) {
		return new Promise((resolve, reject) => {
			let url = "http://localhost:3000/api/spotify/search?q=" + request;
			if (type) {
				url += "&type=" + type;
			}
			$.ajax({
					url: url,
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
}