var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var imagemin = require('gulp-imagemin');
var gm = require('gulp-gm');
var rename = require("gulp-rename");
var merge = require('gulp-merge-json');
var path = require('path');
var AES = require("crypto-js/aes");

var paths = {
  sass: ['./scss/**/*.scss'],
  src: './scss'
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/style.scss')
    .pipe(sass({includePaths: paths.src}))
    .on('error', function (err) {
      displayError(err);
    })
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', ['sass'], function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('serve:before', ['sass', 'watch']);

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


gulp.task('images',function() {
  
  var init =0, limit = 4;
  gulp.src('./puzzles/**/*.{png,jpg,jpeg,PNG,JPG}')
        .pipe(gm(function (gmfile) {
          return gmfile.resize(180, 180);
        }))
        .pipe(gm(function (gmfile) {
          return gmfile.setFormat('jpg');
        }))
        .pipe(imagemin())
        .pipe(rename(function(path){
          path.basename = (init++) % limit;
        }))
        .pipe(gulp.dest('./www/img/puzzles'))
});


gulp.task('solutions', function(){
  gulp.src('./puzzles/**/*.json')
       .pipe(merge({
        fileName: 'solutions.json',
        edit: function (parsedJson, file){
          var folder = path.basename(path.dirname(file.path))
          Object.keys(parsedJson).forEach(function(language) {
            parsedJson[language][folder] = AES.encrypt(parsedJson[language]["answer"], "neroachilles").toString();
            delete parsedJson[language]["answer"]
          });
            return parsedJson;
        }
      }))
      .pipe(gulp.dest('./www/appdata'))

});

gulp.task('puzzles', ['images','solutions']);

var displayError = function(error) {
  // Initial building up of the error
  var errorString = '[' + error.plugin + ']';
  errorString += ' ' + error.message.replace("\n",''); // Removes new line at the end
  // If the error contains the filename or line number add it to the string
  if(error.fileName)
    errorString += ' in ' + error.fileName;
  if(error.lineNumber)
    errorString += ' on line ' + error.lineNumber;
  // This will output an error like the following:
  // [gulp-sass] error message in file_name on line 1
  console.error(errorString);
}
