import gulp from 'gulp';
import babel from 'gulp-babel';

const SRC_PATH = './lib/index.js';
const DIST_PATH = './dist';

gulp.task('build', () => (
  gulp.src(SRC_PATH).pipe(babel()).pipe(gulp.dest(DIST_PATH))
));