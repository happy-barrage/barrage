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
import runSequence from 'run-sequence';
import del from 'del';


const dirs = {
  src: path.join(__dirname, 'src'),
  dest: path.join(__dirname, 'dist'),
  assets: path.join(__dirname, 'assets'),
  public: path.join(__dirname, '../', 'public/dist')
};

gulp.task('webpack-d', (callback) => {
  webpack(config, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({}));

    callback();
  });
});

gulp.task('webpack-s', (callback) => {
  webpack(config_stage, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({}));

    callback();
  });
});

gulp.task('webpack-p', (callback) => {
  webpack(config_production, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({}));

    callback();
  });
});

gulp.task('webpack-dev-server', (callback) => {
  let compiler = webpack(config);

  new WebpackDevServer(compiler, {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: {
      colors: true
    }
  }).listen(9000, 'localhost', (err) => {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }
    gutil.log('[webpack-dev-server]', 'http://localhost:9000/webpack-dev-server/index.html');
  });
});



gulp.task('image', () => {
  gulp.src(`${dirs.assets}/images/*`)
    .pipe(watch(`${dirs.assets}/images/*`))
    .pipe(gulp.dest(`${dirs.dest}/images`));
});

gulp.task('font', () => {
  gulp.src(`${dirs.assets}/fonts/*`)
    .pipe(watch(`${dirs.assets}/fonts/*`))
    .pipe(gulp.dest(`${dirs.dest}/fonts`));
});


gulp.task('svg', () => {
  gulp.src(`${dirs.assets}/svgs/*.svg`)
    .pipe(watch(`${dirs.assets}/svgs/*.svg`))
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
});


gulp.task('image-build', () => {
  gulp.src(`${dirs.assets}/images/*`)
    .pipe(gulp.dest(`${dirs.dest}/images`));
});


gulp.task('svg-build', () => {
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
});

gulp.task('clear-dist', () => {

  del([
    `${dirs.dest}/**/*`,
    `${dirs.public}/**/*`
  ], {
    force : true
  });

});

gulp.task('copy-to-public', () => {
  gulp.src(`${dirs.dest}/**/*`, {base : `${dirs.dest}`})
    .pipe(gulp.dest('../public/dist'));
});

gulp.task('default', ['svg-build', 'font', 'image', 'webpack-dev-server']);


gulp.task('stage', () => {
  runSequence('clear-dist', ['svg-build', 'image-build', 'webpack-s'], 'copy-to-public');
});

gulp.task('production', () => {
  runSequence('clear-dist', ['svg-build', 'image-build', 'webpack-p'], 'copy-to-public');
});