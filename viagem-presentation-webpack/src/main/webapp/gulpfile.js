var gulp = require('gulp')
var stylus = require('gulp-stylus')
var minify = require('gulp-minify-css')
var concat = require('gulp-concat')
var jshint = require('gulp-jshint')
var ngAnnotate = require('gulp-ng-annotate')
var plato = require('gulp-plato')
var browserSync = require('browser-sync').create()
var reload = browserSync.reload
var uglify = require('gulp-uglify')

// ------------ variáveis para facilitar o caminho dos arquivos

var distPaths = {
  css: './resources/styles/css/',
  js: './app'
}

var sourcePaths = {
  stylus: './resources/styles/stylus',
  js: distPaths.js
}

// ------------ tarefas de css/stylus

gulp.task('compileStylusIntoCss', function () {
  return gulp.src(sourcePaths.stylus + '/gumga.styl')
        .pipe(stylus())
        .pipe(concat('gumga.min.css'))
        .pipe(minify())
        .pipe(gulp.dest(distPaths.css))
        .pipe(reload({stream: true}))
})

// ------------ tarefas de javascript

gulp.task('lintTheCode', function (file) {
  return gulp.src(sourcePaths.js + '/modules/gumga/**/*.js')
        .pipe(jshint({'laxcomma': false}))
        .pipe(jshint.reporter('default', {verbose: true}))
        .pipe(reload({stream: true}))
})

gulp.task('uglify', function () {
  return gulp.src(sourcePaths.js + '/modules/gumga/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(sourcePaths.js + '/modules/gumga'))
})

// Não funciona em 100% dos casos.
gulp.task('ngAnnotate', function () {
  return gulp.src(sourcePaths.js + '/modules/gumga/gumga.bundle.js')
        .pipe(ngAnnotate())
        .pipe(gulp.dest(sourcePaths.js + '/modules/gumga'))
        .pipe(reload({stream: true}))
})
// Moderniza seu código para HTML5
gulp.task('modernizr', function () {
  return gulp.src(sourcePaths.js + '/**/*.js')
        .pipe(modernizr())
        .pipe(reload({stream: true}))
})
// Gera relatórios sobre seu código
gulp.task('report', function () {
  return gulp.src('app/**/*.js')
        .pipe(plato('report', {
          jshint: {
            options: {
              strict: true
            }
          },
          complexity: {
            trycatch: true
          }
        }))
})

// ------------ Cria o servidor com autoReload

gulp.task('server', ['compileStylusIntoCss', 'lintTheCode'], function () {
  browserSync.init({
    server: {
      baseDir: './'
    }
  })
  gulp.watch(sourcePaths.stylus + '/**/*.styl', ['compileStylusIntoCss'])
  gulp.watch(sourcePaths.js + '/modules/**/*.js', ['lintTheCode']).on('change', reload)
  gulp.watch('./**/*.html').on('change', reload)
})

gulp.task('default', ['server'])
