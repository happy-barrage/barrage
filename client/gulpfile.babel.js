import gulp from 'gulp';
import gutil from 'gulp-util';
import path from 'path';
import svgSprite from 'gulp-svg-sprite';
import watch from 'gulp-watch';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import config from './webpack.config';
import config_production from './webpack.production.config';
import config_stage from './webpack.stage.config';
import del from 'del';
import shell from 'gulp-shell';

const dirs = {
  src: path.join(__dirname, 'src'),
  dest: path.join(__dirname, 'dist'),
  assets: path.join(__dirname, 'assets'),
  public: path.join(__dirname, '../', 'public/dist')
};

gulp.task('webpack-d', (done) => {
  webpack(config, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({}));
    done();
  });
});

gulp.task('webpack-s', (done) => {
  webpack(config_stage, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({}));
    done();

  });
});

gulp.task('webpack-p', (done) => {
  webpack(config_production, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({}));
    done();

  });
});

gulp.task('webpack-dev-server', (done) => {

  new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: {
      colors: true
    }
  }).listen(9000, 'localhost', (err) => {
    if (err) throw new gutil.PluginError('webpack-dev-server', err);
    gutil.log('[webpack-dev-server]', 'http://localhost:9000/webpack-dev-server/index.html');
  });
});



gulp.task('image', (done) => {
  gulp.src(`${dirs.assets}/images/*`)
    .pipe(watch(`${dirs.assets}/images/*`))
    .pipe(gulp.dest(`${dirs.dest}/images`));
  done();
});

gulp.task('font', (done) => {
  gulp.src(`${dirs.assets}/fonts/*`)
    .pipe(watch(`${dirs.assets}/fonts/*`))
    .pipe(gulp.dest(`${dirs.dest}/fonts`));
  done();
});


gulp.task('image-build', (done) => {
  gulp.src(`${dirs.assets}/images/*`)
    .pipe(gulp.dest(`${dirs.dest}/images`));
  done();
});


gulp.task('svg-build', (done) => {
  gulp.src(`${dirs.assets}/svgs/*.svg`)
    .pipe(svgSprite({
      shape: {
        id: {
          separator: '_',
          generator: 'icon--%s'
        }
      },
      mode: {
        symbol: {
          dest: 'icons',
          sprite: 'sprites.svg'
        }
      }
    }))
    .pipe(gulp.dest(`${dirs.dest}`));
  done();
});

gulp.task('clear-dist', (done) => {

  del([
    `${dirs.dest}/**/*`,
    `${dirs.public}/**/*`
  ], {
    force : true //可以解决不能删除public里面的内容
  },
  done);

});

gulp.task('copy-to-public', (done) => {
  gulp.src(`${dirs.dest}/**/*`, {base : dirs.dest})
    .pipe(gulp.dest(dirs.public));
  done();
});

gulp.task('default', ['svg-build', 'font', 'image', 'webpack-dev-server']);



gulp.task('stage', shell.task([
  'gulp clear-dist',
  'gulp svg-build',
  'gulp image-build',
  'gulp webpack-s',
  'gulp copy-to-public'
]));


gulp.task('production', shell.task([
  'gulp clear-dist',
  'gulp svg-build',
  'gulp image-build',
  'gulp webpack-p',
  'gulp copy-to-public'
]));