var annotate = require('gulp-ng-annotate');
var babel = require('gulp-babel');
var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('default', ['build']);
gulp.task('build', ['js', 'js:min']);

gulp.task('js', function () {
	gulp.src('./src/angular-bs-tooltip.js')
		.pipe(rename('angular-bs-tooltip.js'))
		.pipe(babel({presets: ['es2015']}))
		.pipe(annotate())
		.pipe(gulp.dest('./dist'));
});

gulp.task('js:min', function () {
	gulp.src('./src/angular-bs-tooltip.js')
		.pipe(rename('angular-bs-tooltip.min.js'))
		.pipe(babel({presets: ['es2015']}))
		.pipe(annotate())
		.pipe(uglify({mangle: false}))
		.pipe(gulp.dest('./dist'));
});
