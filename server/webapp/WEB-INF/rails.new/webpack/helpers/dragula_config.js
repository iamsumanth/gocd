/*
 * Copyright 2016 ThoughtWorks, Inc.
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

var m             = require('mithril');
var dragula       = require('dragula');
var _             = require('lodash');
var dragulaConfig = function (elem, options) {

  var opts = _.extend({revertOnSpill: true, mirrorContainer: elem}, options.dragulaOptions);

  var drake = dragula([elem], opts);

  drake.on('drop', function () {
    try {
      options.onDropCallback();
    } finally {}
  });
};

module.exports = dragulaConfig;