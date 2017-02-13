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

var m                = require('mithril');
var Stream           = require('mithril/stream');
var _                = require('lodash');
var mrequest         = require('helpers/mrequest');
var TriStateCheckbox = require('models/agents/tri_state_checkbox');
var Routes           = require('gen/js-routes');
var Resources        = {};
Resources.list       = Stream([]);

var getSortedResources = function (resources, selectedAgents) {
  var selectedAgentsResources = _.map(selectedAgents, function (agent) {
    return agent.resources();
  });

  return _.map(resources.sort(), function (resource) {
    return new TriStateCheckbox(resource, selectedAgentsResources);
  });
};

Resources.init = function (selectedAgents) {
  m.request({
    method:        'GET',
    url:           Routes.apiv1AdminInternalResourcesPath(),
    config:        mrequest.xhrConfig.v1,
    unwrapSuccess: function (responseBody) {
      var sortedResources = getSortedResources(responseBody, selectedAgents);
      Resources.list(sortedResources);
    }
  });
};

module.exports = Resources;
