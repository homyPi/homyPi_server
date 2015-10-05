var gulp = require('gulp');
gulp.task('buildClient', ['browserifyClient', 'styles', 'html'], function() {
	process.exit();
});