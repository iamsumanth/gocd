/*
 * Copyright 2017 ThoughtWorks, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*global __dirname module */
/*eslint no-undef: "error"*/

'use strict';

var process     = require('process');
var fs          = require('fs');
var fsExtra     = require('fs-extra');
var _           = require('lodash');
var path        = require('path');
var webpack     = require('webpack');
var StatsPlugin = require('stats-webpack-plugin');
var glob        = require('glob');

var singlePageAppModuleDir = path.join(__dirname, '..', 'webpack', 'single_page_apps');

module.exports = function (env) {
  var production = (env && env.production === 'true');

  var entries = _.reduce(fs.readdirSync(singlePageAppModuleDir), function (memo, file) {
    var fileName     = path.basename(file);
    var moduleName   = "single_page_apps/" + _.split(fileName, '.')[0];
    memo[moduleName] = path.join(singlePageAppModuleDir, file);
    return memo;
  }, {});

  var config = {
    cache:     true,
    bail:      true,
    entry:     entries,
    output:    {
      path:       path.join(__dirname, '..', 'public', 'assets', 'webpack'),
      publicPath: '/go/assets/webpack/',
      filename:   production ? '[name]-[chunkhash].js' : '[name].js'
    },
    resolve:   {
      modules:    [path.join(__dirname, '..', 'webpack'), 'node_modules'],
      extensions: ['.js', '.js.msx', '.msx', '.es6'],
      alias:      {
        'string-plus':         'helpers/string-plus',
        'string':              'underscore.string',
        'jQuery':              'jquery',
        'jquery.textcomplete': 'jquery-textcomplete',
        'js-routes':           'gen/js-routes'
      }
    },
    devServer: {
      hot:    false,
      inline: false
    },
    plugins:   [
      new StatsPlugin('manifest.json', {
        chunkModules: false,
        source:       false,
        chunks:       false,
        modules:      false,
        assets:       true
      }),
      new webpack.ProvidePlugin({
        $:               "jquery",
        jQuery:          "jquery",
        "window.jQuery": "jquery"
      }),
      new webpack.NoEmitOnErrorsPlugin()
    ],
    module:    {
      rules: [
        {
          test: /\.js\.msx$/,
          use:  [
            {
              loader: 'babel-loader'
            }
          ]
        }
      ]
    }
  };

  if (production) {
    fsExtra.removeSync(config.output.path);

    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      },
      sourceMap:  false
    }));

    config.plugins.push(new webpack.LoaderOptionsPlugin({
      minimize: true
    }));

    config.plugins.push(new webpack.DefinePlugin({
      'process.env': {NODE_ENV: JSON.stringify('production')}
    }));
  } else {
    config.devtool = "inline-source-map";
    config.resolve.modules.push(path.join(__dirname, '..'));
    var jasmineCore  = require('jasmine-core');
    var jasmineFiles = jasmineCore.files;

    var HtmlWebpackPlugin = require('html-webpack-plugin');

    var jasmineIndexPage = {
      inject:          'head',
      xhtml:           true,
      filename:        '_specRunner.html',
      template:        path.join(__dirname, '..', 'spec', 'webpack', '_specRunner.html.ejs'),
      jasmineJsFiles:  _.map(jasmineFiles.jsFiles.concat(jasmineFiles.bootFiles), function (file) {
        return '__jasmine/' + file;
      }),
      jasmineCssFiles: _.map(jasmineFiles.cssFiles, function (file) {
        return '__jasmine/' + file;
      })
    };

    config.plugins.push(new HtmlWebpackPlugin(jasmineIndexPage));

    var resolveJasmineDir = function (dirname) {
      return dirname.replace(process.cwd(), '').replace(/^\//, '');
    };

    var jasminePath = resolveJasmineDir(jasmineFiles.path);

    var specFiles   = glob.sync('spec/webpack/**/*[sS]pec.js');
    var specHelpers = glob.sync('spec/webpack/helpers/**/*.js');

    var specEntries = _.reduce(specFiles.concat(specHelpers), function (memo, file) {
      var moduleName   = _.split(file, '.')[0];
      memo[moduleName] = path.join(__dirname, '..', file);
      return memo;
    }, {});

    config.entry = _.merge(config.entry, specEntries);

    var MyPlugin = function (options) {
      this.apply = function (compiler) {
        compiler.plugin('emit', function (compilation, callback) {
          var allJasmineAssets = jasmineFiles.jsFiles.concat(jasmineFiles.bootFiles).concat(jasmineFiles.cssFiles);

          _.each(allJasmineAssets, function (asset) {
            var file     = path.join(jasminePath, asset);
            var contents = fs.readFileSync(file).toString();

            compilation.assets['__jasmine/' + asset] = {
              source: function () {
                return contents;
              },
              size:   function () {
                return contents.length;
              }
            };
          });

          callback();
        });
      };
    };

    config.plugins.push(new MyPlugin());
  }

  return config;
};
