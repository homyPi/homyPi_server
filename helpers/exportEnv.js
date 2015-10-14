var spawn = require('child_process').spawn;

var spawnParams = ['encrypt', '--add', 'env'];
console.log("Getting .env file");
var rl = require('readline').createInterface({
  input: require('fs').createReadStream('./.env')
});
rl.on('line', function (line) {
	console.log("new line");
  if(line) {  
    spawnParams.push(line);
  }
});
rl.on("close", function() {

	console.log(spawnParams.join(" "));
	var child = spawn('travis', spawnParams);
    child.stdout.on('data', function (data) { console.log("line: " + data); });
    child.stdout.on('end', function () { });
});