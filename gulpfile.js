var electronVersion = "1.0.1";


var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var jsonminify = require('gulp-jsonminify');
var install = require("gulp-install");
var del = require('del');
var ngmin = require('gulp-ngmin');
var nodemon = require('gulp-nodemon');
var bower = require('gulp-bower');
var packager = require('electron-packager');
var packageJson = require('./src/package.json');
var plumber = require('gulp-plumber');  //prevent watch crash
var gulpsync = require('gulp-sync')(gulp);
var winInstaller = require('electron-winstaller');

//retreive package.json data
var pjson = require('./package.json');

gulp.task('less', function () {
  return gulp.src('./src/app/css/substream.less')
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(gulp.dest('./dist/app/css'));
});

gulp.task('clean:dist', function() {
  return del('./dist/**/*');
});

gulp.task('clean:build', function() {
  return del('./build/**/*');
});

gulp.task('install-dependencies', function() {
  return bower({ cwd: './src',interactive:true });
});

gulp.task('scripts', function() {
  return gulp.src('./src/app/js/**/*.js')
    .pipe(plumber())
    .pipe(ngmin())
  	.pipe(uglify({mangle: false}))
    .pipe(concat('substream.min.js'))
    .pipe(gulp.dest('./dist/app/js/'));
});

gulp.task('images', function(cb) {
    return gulp.src(['src/app/**/*.png','src/app/**/*.jpg','src/app/**/*.gif','src/app/**/*.jpeg','src/app/**/*.svg','src/app/**/*.ico'])
    .pipe(gulp.dest('./dist/app/'));
});

gulp.task('copy-dependencies', function() {
  return gulp.src('./src/app/vendors/**/*')
  .pipe(gulp.dest('./dist/app/vendors/'));
});

gulp.task('html', function() {
return gulp.src('src/app/**/*.html')
    .pipe(plumber())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist/app'))
});

gulp.task('locales', function () {
return gulp.src(['./src/app/locales/*.json'])
        .pipe(jsonminify())
        .pipe(gulp.dest('./dist/app/locales/'));
});

gulp.task('install-dist-dep',function(){
  return gulp.src(['./dist/package.json'])
  .pipe(install());
});

gulp.task('copy-electron-components',function(){
  return gulp.src(['./src/*.js', './src/*.json'])
  .pipe(gulp.dest('./dist'))
});

gulp.task('electron-build', function(callback) {
  var options = {
        dir: "./dist",
        name: "Substream",
        platform: "win32",
        arch: "x64",
        'app-version':pjson.version,
        'build-version':pjson.version,
        overwrite: true,
        icon: "./dist/app/img/tgf/icon_circle.png",
        out: "build"
    };
    packager(options, function done (err, appPath) {
        if(err) { return console.log(err); }
        callback();
    });
});

gulp.task('watch', function () {
  gulp.watch('./src/app/css/**/*.less', ['less']);
  gulp.watch('./src/app/**/*.html', ['html']);
  gulp.watch('./src/app/**/*.js', ['scripts']);
  gulp.watch('./src/*', ['copy-electron-components']);
});

gulp.task('create-windows-installer',function(){
  del('./release/**/*');
  return resultPromise = winInstaller.createWindowsInstaller({
    appDirectory: './build/substream-win32-x64',
    outputDirectory: './release',
    authors: 'Cyriaque DELAUNAY',
    iconUrl: __dirname+'/dist/app/img/tgf/icon_circle.ico',
    setupIcon : './dist/app/img/tgf/icon_setup.ico',
    exe: 'Substream.exe',
    setupExe:'Setup.exe',
    noMsi : true,
    title : 'Substream'
  });

  console.log(iconUrl);

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));

});

gulp.task('prepare-dev-env', gulpsync.sync([
    // sync
    'clean:dist',
    ['install-dependencies'],
    [
        // async
        'less',
        'scripts',
        'html',
        'copy-dependencies',
        'images',
        'locales',
        'copy-electron-components',
    ],
    ['install-dist-dep']
]));

gulp.task('build', gulpsync.sync([
    ['clean:build'],
    ['prepare-dev-env'],
    ['electron-build'],
    ['create-windows-installer']
]));

gulp.task('default', gulpsync.sync([
    ['prepare-dev-env'],
    ['watch']
]));
