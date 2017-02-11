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
var _                = require('lodash');
var mrequest         = require('helpers/mrequest');
var TriStateCheckbox = require('models/agents/tri_state_checkbox');
var Routes           = require('js-routes');
var Environments     = {};
Environments.list    = [];

var getSortedEnvironments = function (environments, selectedAgents) {
  var selectedAgentsEnvironments = _.map(selectedAgents, function (agent) {
    return agent.environments();
  });

  return _.map(environments.sort(), function (environment) {
    return new TriStateCheckbox(environment, selectedAgentsEnvironments);
  });
};

Environments.init = function (selectedAgents) {
  m.request({
    method:        'GET',
    url:           Routes.apiv1AdminInternalEnvironmentsPath(),
    config:        mrequest.xhrConfig.v1,
    unwrapSuccess: function (responseBody) {
      Environments.list = getSortedEnvironments(responseBody, selectedAgents);
    }
  });
};

module.exports = Environments;
