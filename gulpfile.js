var gulp = require('gulp');
var sass = require('gulp-sass');
var print = require('gulp-print');

var plumber = require('gulp-plumber');
var handlebars = require('gulp-handlebars');
var concat = require('gulp-concat');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var addsrc = require('gulp-add-src');

var tasks = function(){
  compileSass();
  compileJS(['src/tpl/*.handlebars'], 'stories', ['src/js/stories.js', 'src/js/stories-yasmina.js'], 'dist/js', "stories-yasmina-build.js");
};

var compileJS = function(srcTpl, namespace, srcJs, destFolder, destFile){
  gulp.src(srcTpl)
    .pipe(plumber())
    .pipe(handlebars({
      handlebars: require('handlebars') // FIX: Template was precompiled with an older version of …ur runtime to an older version
    }))
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: namespace + '.templates',
      noRedeclare: true, // Avoid duplicate declarations
    }))
    .pipe(addsrc(srcJs))
    .pipe(concat(destFile))
    .pipe(gulp.dest(destFolder))
    .pipe(print(function (filepath) {
      return filepath + " builded!";
    }));
};

var compileSass = function(){
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'))
    .pipe(print(function (filepath) {
            return filepath + " builded!";
    }));
};

gulp.task('watch', function () {
  tasks();
  return gulp.watch(['./src/**'], tasks);
});

gulp.task('default', function () {
  tasks();
  //gulp.start('watch');
});
