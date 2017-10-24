var babel = require('gulp-babel');
var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('default', ['build']);
gulp.task('build', ['js']);

gulp.task('js', ()=>
	gulp.src('./src/angular-bs-tooltip.js')
		.pipe(rename('angular-bs-tooltip.js'))
		.pipe(babel({
			presets: ['es2015'],
			plugins: ['angularjs-annotate'],
		}))
		.pipe(gulp.dest('./dist'))
		.pipe(rename('angular-bs-tooltip.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist'))
);
