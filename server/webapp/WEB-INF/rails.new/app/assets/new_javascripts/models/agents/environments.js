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

define(['mithril', 'lodash', 'helpers/mrequest', 'models/agents/tri_state_checkbox'], function (m, _, mrequest, EnvironmentCheckbox) {
  var Environments  = {};
  Environments.list = [];

  var isPresentOnAll = function (selectedAgents, value) {
    return _.every(selectedAgents, function (agent) {
      return _.includes(agent.environments(), value);
    })
  };

  var isPresentOnAny = function (selectedAgents, value) {
    return _.some(selectedAgents, function (agent) {
      return _.includes(agent.environments(), value);
    })
  };

  Environments.init = function (selectedAgents) {
    m.request({
      method:        'GET',
      url:           Routes.apiv1AdminInternalEnvironmentsPath(),
      config:        mrequest.xhrConfig.v1,
      unwrapSuccess: function (responseBody) {
        Environments.list = _.map(responseBody, function (value) {
          var isChecked       = isPresentOnAll(selectedAgents, value);
          var isIndeterminate = !isChecked && isPresentOnAny(selectedAgents, value);
          return new EnvironmentCheckbox(value, isChecked, isIndeterminate);
        });
      }
    })
  };

  return Environments;
});
