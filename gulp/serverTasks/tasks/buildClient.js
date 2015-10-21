var gulp = require('gulp');
var modules = require("../../clientTasks/tasks/modules");
gulp.task('buildClient', ['modules', 'browserifyClient', 'styles', 'html'], function() {
	process.exit();
});