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

var $              = require('jquery');
var m              = require('mithril');
var Stream         = require('mithril/stream');
var Agents         = require('models/agents/agents');
var AgentsWidget   = require('views/agents/agents_widget');
var AgentsVM       = require('views/agents/models/agents_widget_view_model');
var VersionUpdater = require('models/shared/version_updater');
require('foundation-sites');

$(function () {
  new VersionUpdater().update();

  var agentsDOMElement = document.getElementById('agents');

  var isUserAdmin = JSON.parse($(agentsDOMElement).attr('is-current-user-an-admin'));

  $(document).foundation();

  m.route.prefix("#");

  var agents = Stream(new Agents());

  var agentsViewModel = new AgentsVM();

  var component = {
    view: function () {
      return m(AgentsWidget, {vm: agentsViewModel, allAgents: agents, isUserAdmin: isUserAdmin})
    }
  };

  m.route(agentsDOMElement, '', {
    '':                  component,
    '/:sortBy/:orderBy': component
  });
});

