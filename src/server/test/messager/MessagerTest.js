import Messager from "../../modules/Messager";

var app = require("express")();
var server = require('http').createServer(app);

let messager = new Messager(server);


messager.start()
	.then(function() {
		console.log("ready");
	})
	.catch(function(err) {
		console.log(err);
		process.exit()
	});
server.listen(process.env.PORT || 3000, function () {
});