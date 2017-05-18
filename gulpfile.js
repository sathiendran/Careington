var gulp = require('gulp'),
    gutil = require('gulp-util'),
    bower = require('bower'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    less = require('gulp-less'),
    prefixer = require('gulp-autoprefixer'),
    prefixerOptions = { browsers: ['last 1 versions'] },
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    sh = require('shelljs');

var path = {
    build: {
        css: './www/css/',
        fonts: './www/fonts/',
    },
    src: {
        scss: './scss/ionic.app.scss',
        less: './less/styles.less',
        fonts: './fonts/**/*.*',
    },
    watch: {
        scss: './scss/**/*.scss',
        less: './less/**/*.*',
        // fonts: './fonts/**/*.*',
    }
};


gulp.task('sass', function(done) {
  gulp.src(path.src.scss)
    .pipe(sass({errLogToConsole: true}))
    .pipe(gulp.dest(path.build.css))
    .pipe(minifyCss({
        keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(path.build.css))
    .on('end', done);
});

gulp.task('less', function (done) {
    gulp.src(path.src.less)
        .pipe(less())
        .pipe(prefixer(prefixerOptions))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(path.build.css))
        .on('end', done);
});

gulp.task('fonts', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('watch', function() {
    gulp.watch(path.watch.scss, ['sass']);
    gulp.watch(path.watch.less, ['less']);
    // gulp.watch(path.watch.less, ['fonts']);
});

gulp.task('default', ['sass', 'less', 'watch']);

gulp.task('serve:before', [ "sass", "less", "watch"]);

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
