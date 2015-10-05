var requireDir = require("require-dir");


requireDir('./gulp/clientTasks', { recurse: true });
requireDir('./gulp/serverTasks', { recurse: true });