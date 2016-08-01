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

define(["jquery", "mithril", 'models/agents/agents', "views/agents/agent_row_widget"], function ($, m, Agents, AgentsRowWidget) {
  describe("Agent Row Widget", function () {
    var $root = $('#mithril-mount-point'), root = $root.get(0);
    beforeAll(function () {
      var key   = 'uuid-1';
      var agents = m.prop();
      var allAgents = Agents.fromJSON(json(key));
      agents(allAgents);
      mount(agents().firstAgent(), key);
    });

    it('should contain the agent information', function () {
      var row = $root.find('tr')[0];
      var information = row.children;
      expect(information[1].innerText).toBe('in-john.local');
      expect(information[2].innerText).toBe('/var/lib/go-agent');
      expect(information[3].innerText).toBe('Linux');
      expect(information[4].innerText).toBe('10.12.2.200');
      expect(information[5].innerText).toBe('Missing');
      expect(information[6].innerText).toBe('unknown');
      expect(information[7].innerText).toBe('firefox');
      expect(information[8].innerText).toBe('Dev');
    });

    it('should check the value based on the checkboxmodel result', function(){
      var checkbox = $root.find('input')[0];
      expect(checkbox.checked).toBe(model());
    });

    var mount = function (agent, key) {
      m.mount(root,
        m.component(AgentsRowWidget,
          {
            'agent': agent,
            'key': key,
            'checkBoxModel': model
          })
      );
      m.redraw(true);
    };

    var model = function(){
      return true;
    };

    var json = function(uuid){
      return [
        {
          "_links": {
            "self": {
              "href": "https://ci.example.com/go/api/agents/dfdbe0b1-4521-4a52-ac2f-ca0cf6bdaa3e"
            },
            "doc": {
              "href": "http://api.go.cd/#agents"
            },
            "find": {
              "href": "https://ci.example.com/go/api/agents/:uuid"
            }
          },
          "uuid": uuid,
          "hostname": "in-john.local",
          "ip_address": "10.12.2.200",
          "sandbox": "/var/lib/go-agent",
          "operating_system": "Linux",
          "free_space": "unknown",
          "agent_config_state": "Enabled",
          "agent_state": "Missing",
          "build_state": "Unknown",
          "resources": [
            "firefox"
          ],
          "environments": [
            "Dev"
          ]
        }
      ];
    }
  });
});
