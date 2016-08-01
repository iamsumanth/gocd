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

define(["jquery", "mithril",
    'models/agents/agents',
    "views/agents/agents_widget",
  ],
  function ($, m, Agents, AgentsWidget) {
    describe("Agents Widget", function () {
      var $root = $('#mithril-mount-point'), root = $root.get(0);
      var agents;
      var allBoxes;
      var selectAllCheckbox;

      beforeAll(function () {
        jasmine.Ajax.install();
        jasmine.Ajax.stubRequest(/\/api\/admin\/internal\/resources/).andReturn({ "status": 304 });
        jasmine.Ajax.stubRequest(/\/api\/admin\/internal\/environments/).andReturn({ "status": 304 });

        agents        = m.prop();
        var allAgents = Agents.fromJSON(json());
        agents(allAgents);
        mount(agents, selectAllViewModel);
        allBoxes = $root.find('tbody input');
        selectAllCheckbox = $root.find('thead input')[0];
      });

      afterAll(function () {
        jasmine.Ajax.uninstall();
      });

      //TODO looks repeated
      it('should contain all the buttons', function () {
        var buttons = $root.find('.button.group-element');
        expect(buttons.length).toBe(5);

        expect(buttons[0].innerText).toBe('Delete');
        expect(buttons[1].innerText).toBe('Disable');
        expect(buttons[2].innerText).toBe('Enable');
        expect(buttons[3].innerText).toBe('Resources');
        expect(buttons[4].innerText).toBe('Environments');
      });


      it('should contain message div to display operation messages', function () {
        var messagePane = $root.find('#message_pane');
        expect(messagePane.length).not.toBe(0);
      });

      it('should contain the agents state count information', function () {
        var agentStateCount = $root.find('.agent_state')[0];
        var stateCountInfo  = " Total : 1 |  Pending : 0 |  Enabled : 1 |  Disabled : 0 ";
        expect(agentStateCount.innerText).toBe(stateCountInfo);
      });

      describe('Agents Table', function () {
        it('should contain the agents table header information', function () {
          var headings = $root.find('thead th');
          expect(headings.length).toBe(9);
          expect(headings[0].innerHTML).toBe('<input type="checkbox">');
          expect(headings[1].innerText).toBe('Agent Name');
          expect(headings[2].innerText).toBe('Sandbox');
          expect(headings[3].innerText).toBe('OS');
          expect(headings[4].innerText).toBe('IP Address');
          expect(headings[5].innerText).toBe('Status');
          expect(headings[6].innerText).toBe('Free Space');
          expect(headings[7].innerText).toBe('Resources');
          expect(headings[8].innerText).toBe('Environments');
        });

        it('should contain the agent rows equal to the number of agents', function () {
          var agentRows = $root.find('table tbody tr');
          expect(agentRows.length).toBe(agents().countAgent());
        });

        it('should contain the agent row information', function () {
          var agentInfo = $root.find('table tr td');
          expect(agentInfo.length).toBe(9);
          expect(agentInfo[0].innerHTML).toBe('<input type="checkbox">');
          expect(agentInfo[1].innerText).toBe('in-john.local');
          expect(agentInfo[2].innerText).toBe('usr/local/foo');
          expect(agentInfo[3].innerText).toBe('Linux');
          expect(agentInfo[4].innerText).toBe('10.12.2.200');
          expect(agentInfo[5].innerText).toBe('Missing');
          expect(agentInfo[6].innerText).toBe('unknown');
          expect(agentInfo[7].innerText).toBe('Firefox');
          expect(agentInfo[8].innerText).toBe('none specified');
        });

        it('should select all the agents when selectAll checkbox is selected', function(){
          var agentCheckbox = allBoxes[0];
          expect(selectAllCheckbox.checked).toBe(false);
          expect(agentCheckbox.checked).toBe(false);

          selectAllCheckbox.click();
          expect(selectAllCheckbox.checked).toBe(true);
          expect(agentCheckbox.checked).toBe(true);
        });
      });

      var mount = function (agents, selectAllViewModel) {
        m.mount(root,
          m.component(AgentsWidget,
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

      var togglePolling      = function () {
      };
      var fetch              = function () {
      };
      var setFilterText      = function () {
      };
      var selectAllViewModel = {
        boxes: {},
        anySelected: function () {
          return false;
        },
        checkedAgents: function () {
          return [];
        },
        allBoxes: function () {
        },
        clickAllBoxes: function() {
            allBoxes[0].checked = true;
            selectAllCheckbox.checked = true;
        }
      };

      var json = function () {
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
