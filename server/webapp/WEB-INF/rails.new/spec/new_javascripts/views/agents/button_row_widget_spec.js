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

define(["jquery", "mithril", "lodash",
    'models/agents/agents',
    "views/agents/button_row_widget",
  ],
  function ($, m, _, Agents, ButtonRowWidget) {
    describe("Button Row Widget", function () {
      var agents;
      var agent;
      var selectedAgents = [];

      var $root = $('#mithril-mount-point'), root = $root.get(0);

      beforeAll(function () {
        jasmine.Ajax.install();
        jasmine.Ajax.stubRequest(/\/api\/admin\/internal\/resources/).andReturn({
          "responseText": JSON.stringify(["Firefox", "Linux"]),
          "status": 200
        });
        jasmine.Ajax.stubRequest(/\/api\/admin\/internal\/environments/).andReturn({
          "responseText": JSON.stringify(["Dev"]),
          "status": 200
        });

        agents        = m.prop();
        var allAgents = Agents.fromJSON(json());
        agents(allAgents);
        agent = allAgents.firstAgent();
        mount(agents);
      });

      afterAll(function () {
        jasmine.Ajax.uninstall();
      });

      beforeEach(function() {
        m.redraw(true);
      });

      describe('Heading Row', function () {
        it('should contain the agents page heading text', function () {
          var headingText = $root.find('.heading h1')[0].innerText;
          expect(headingText).toBe('Agents');
        });
      });

      describe('Button Group', function () {
        it('should contain the row elements', function () {
          var row         = $root.find('.button_group')[0];
          var rowElements = row.children;
          expect(rowElements.length).toBe(7);
          expect(rowElements[0].innerText).toBe("Delete");
          expect(rowElements[1].innerText).toBe("Disable");
          expect(rowElements[2].innerText).toBe("Enable");
          expect(rowElements[3].innerText).toBe("Resources");
          expect(rowElements[4].id).toBe("resources_list");
          expect(rowElements[5].innerText).toBe("Environments");
          expect(rowElements[6].id).toBe("environments_list");
        });

        it('should disable the buttons if agents are not selected', function () {
          selectedAgents = [];
          var row         = $root.find('.button_group')[0];
          var rowElements = row.children;
          expect(rowElements[0].disabled).toBe(true);
          expect(rowElements[1].disabled).toBe(true);
          expect(rowElements[2].disabled).toBe(true);
          expect(rowElements[3].disabled).toBe(true);
          expect(rowElements[5].disabled).toBe(true);
        });

        it('should enable the buttons if at least one agent is selected', function () {
          var row         = $root.find('.button_group')[0];
          var rowElements = row.children;
          selectedAgents = [agent];
          m.redraw(true);

          expect(rowElements[0].disabled).toBe(false);
          expect(rowElements[1].disabled).toBe(false);
          expect(rowElements[2].disabled).toBe(false);
          expect(rowElements[3].disabled).toBe(false);
          expect(rowElements[5].disabled).toBe(false);
        });

        it('should toggle the resources list on click of the resources button', function(){
          var resourceButton = $root.find('.button_group')[0].children[3];
          var resourcesList = $root.find('#resources_list')[0];
          expect(resourcesList.classList).not.toContain('is-open');

          resourceButton.click();
          expect(resourcesList.classList).toContain('is-open');

          resourceButton.click();
          expect(resourcesList.classList).not.toContain('is-open');
        });

        it('should toggle the environments list on click of the environments button', function(){
          var environmentButton = $root.find('.button_group')[0].children[5];
          var environmentsList = $root.find('#environments_list')[0];
          expect(environmentsList.classList).not.toContain('is-open');

          environmentButton.click();
          expect(environmentsList.classList).toContain('is-open');

          environmentButton.click();
          expect(environmentsList.classList).not.toContain('is-open');
        });
      });

      var mount = function (agents) {
        m.mount(root,
          m.component(ButtonRowWidget,
            {
              'agents': agents,
              'togglePolling': togglePolling,
              'fetch': fetch,
              'setFilterText': setFilterText,
              'selectAllViewModel': selectAllViewModel
            })
        );
        m.redraw(true);
      };

      var filterText;

      var togglePolling      = function () {
      };
      var fetch              = function () {
        if(!_.includes(JSON.stringify(agent.toJSON()), filterText)){
          agents([]);
          mount(agents);
          m.redraw(true);
        }
      };


      var setFilterText      = function (text) {
        filterText = text;
      };

      var selectAllViewModel = {
        boxes: { },
        anySelected: function(){
          return selectedAgents.length > 0;
        },
        checkedAgents: function(){
          return selectedAgents;
        }

      };

      var json = function () {
        return [
          {
            "_links": {
              "self": {
                "href": "https://ci.example.com/go/api/agents/uuid-1"
              },
              "doc": {
                "href": "http://api.go.cd/#agents"
              },
              "find": {
                "href": "https://ci.example.com/go/api/agents/:uuid"
              }
            },
            "uuid": "uuid-1",
            "hostname": "in-john.local",
            "ip_address": "10.12.2.200",
            "sandbox": "usr/local/foo",
            "operating_system": "Linux",
            "free_space": "unknown",
            "agent_config_state": "Enabled",
            "agent_state": "Missing",
            "build_state": "Unknown",
            "resources": [
              "Firefox"
            ],
            "environments": []
          }
        ];
      };

    });
  });
