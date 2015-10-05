import $ from 'jquery'
import UserAPI from "../apis/UserAPI.jsx"

import config from "../config.js"
var serverUrl = config.server_url || "";

function setHeaders(xhr) {
    xhr.setRequestHeader ("Authorization", "Bearer " + UserAPI.getToken());
}

export default {
	getAlarms() {
		return new Promise((resolve, reject) => {
			$.ajax({
					url: serverUrl + "/api/alarms/",
					type: "GET",
					beforeSend: setHeaders,
					success: function(resp) {
						
						resolve(resp.alarms);
					},
					fail: function(err) {
						reject(err)
					}
				});
		});
	},
	deleteAlarm(alarm) {
		return new Promise((resolve, reject) => {
			$.ajax({
					url: serverUrl + "/api/alarms/" + alarm._id,
					type: "DELETE",
					beforeSend: setHeaders,
					success: function(resp) {
						resolve(alarm);
					},
					fail: function(err) {
						reject(err)
					}
				});
		});
	},
	insertAlarm(alarm) {
		return new Promise((resolve, reject) => {
			$.ajax({
					url: serverUrl + "/api/alarms/",
					type: "POST",
				    data: JSON.stringify({ alarm: alarm }),
				    contentType: "application/json; charset=utf-8",
				    dataType: "json",
					beforeSend: setHeaders,
					success: function(resp) {
						alarm._id = resp.alarm._id;
						resolve(alarm);
					},
					fail: function(err) {
						reject(err)
					}
				});
		});
	},
	updateAlarm(alarm) {
		return new Promise((resolve, reject) => {
			$.ajax({
					url: serverUrl + "/api/alarms/" + alarm._id,
					type: "PUT",
					data: JSON.stringify({
						hours: alarm.hours,
						minutes: alarm.minutes
					}),
				    contentType: "application/json; charset=utf-8",
				    dataType: "json",
					beforeSend: setHeaders,
					success: function(resp) {
						resolve(alarm);
					},
					fail: function(err) {
						reject(err)
					}
				});
		});
	},
	enableAlarm(alarm, enabled) {
		return new Promise(function(resolve, reject) {
			$.ajax({
					url: serverUrl + "/api/alarms/" + alarm._id,
					type: "PUT",
					data: JSON.stringify({ enable: enabled}),
				    contentType: "application/json; charset=utf-8",
				    dataType: "json",
					beforeSend: setHeaders,
					success: function(resp) {
						alarm.enable = enabled;
						resolve(alarm);
					},
					fail: function(err) {
						reject(err)
					}
				});
		});
	}
};