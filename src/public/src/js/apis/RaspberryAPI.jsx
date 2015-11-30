import $ from 'jquery'
import UserAPI from "../apis/UserAPI.jsx"

import config from "../config.js"
var serverUrl = config.server_url || "";

function setHeaders(xhr) {
    xhr.setRequestHeader ("Authorization", "Bearer " + UserAPI.getToken());
}
var getAllPromise = null;
export default {
	getAll() {
		if (getAllPromise) return getAllPromise;
		getAllPromise =  new Promise((resolve, reject) => {
			$.ajax({
					url: serverUrl + "/api/raspberries/",
					type: "GET",
					beforeSend: setHeaders,
					success: function(resp) {
						getAllPromise = null;
						if (resp.status === "success") {
							resolve(resp.data.items);
						} else {
							reject(resp.error);
						}
					},
					fail: function(err) {
						getAllPromise = null;
						reject(err)
					}
				});
		});
		return getAllPromise;
	},
	get(name) {
		return new Promise((resolve, reject) => {
			$.ajax({
					url: serverUrl + "/api/raspberries/" + name,
					type: "GET",
					beforeSend: setHeaders,
					success: function(resp) {
						if (resp.status === "success") {
							resolve(resp.data.raspberry);
						} else {
							reject(resp.error);
						}
					},
					fail: function(err) {
						reject(err)
					}
				});
		});
	},
	add(name) {

		new Promise((resolve, reject) => {
			$.ajax({
					url: serverUrl + "/api/raspberries/",
					type: "POST",
				    data: JSON.stringify({"name": name, "modules": ["alarm", "music"]}),
				    contentType: "application/json; charset=utf-8",
				    dataType: "json",
					beforeSend: setHeaders,
					success: function(resp) {
						getAllPromise = null;
						if (resp.status === "success") {
							resolve(resp.data);
						} else {
							reject(resp.error);
						}
					},
					fail: function(err) {
						getAllPromise = null;
						reject(err)
					}
				});
		});
	}
};