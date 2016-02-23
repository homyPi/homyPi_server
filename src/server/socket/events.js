import Raspberry from "../models/Raspberry";

function setEvents(mqtt) {
	mqtt.on('raspberry:module:new', function(data, topicInfo){
		console.log("in raspberry:module:new " + topicInfo + ": " + JSON.stringify(data, null, 2));
		let {source, raspberry} = topicInfo;
		if (!raspberry) return;
		Raspberry.moduleStarted(raspberry, data)
			.then(function(raspberry, module) {
				console.log("DONE ");
			}).catch(function(err) {
				console.log(err);
			});
	});
}

export default setEvents;