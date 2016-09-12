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

define(["jquery", "mithril", "lodash", 'models/agents/agents', "views/agents/button_row_widget"], function ($, m, _, Agents, ButtonRowWidget) {
  describe("Button Row Widget", function () {

    var agents;
    var agent;

    var $root = $('#mithril-mount-point'), root = $root.get(0);

    var vm = {
      agentsCheckedState: {}
    };

    vm.dropdown = {
      reset:  m.prop(true),
      states: {},
      add:    function () {
      }
    };

    vm.dropdown.states['environment'] = m.prop(false);
    vm.dropdown.states['resource']    = m.prop(false);

    var selectedAgents     = function () {
    };
    var disableAgents      = function () {
    };
    var enableAgents       = function () {
    };
    var deleteAgents       = function () {
    };
    var updateResources    = function () {
    };
    var updateEnvironments = function () {
    };

    beforeAll(function () {
      jasmine.Ajax.install();
      jasmine.Ajax.stubRequest(/\/api\/admin\/internal\/resources/).andReturn({
        "responseText": JSON.stringify(["Firefox", "Linux"]),
        "status":       200
      });
      jasmine.Ajax.stubRequest(/\/api\/admin\/internal\/environments/).andReturn({
        "responseText": JSON.stringify(["Dev"]),
        "status":       200
      });

      agents        = m.prop();
      var allAgents = Agents.fromJSON(json());
      agents(allAgents);
      agent = allAgents.firstAgent();
      var isAnyAgentSelected = m.prop(false);
      mount(vm, isAnyAgentSelected);
    });

    afterAll(function () {
      jasmine.Ajax.uninstall();
      unmount();
    });

    beforeEach(function () {
      m.redraw(true);
    });

    describe('Heading Row', function () {
      it('should contain the agents page heading text', function () {
        var headingText = $root.find('.page-header h1').text();
        expect(headingText).toBe('Agents');
      });
    });

    describe('Button Group', function () {
      it('should contain the row elements', function () {
        var rowElements = $root.find('.agent-button-group button');
        expect(rowElements.length).toBe(8);
        expect($(rowElements[0]).text()).toBe("Delete");
        expect($(rowElements[1]).text()).toBe("Disable");
        expect($(rowElements[2]).text()).toBe("Enable");
        expect($(rowElements[3]).text()).toBe("Resources");
        expect($(rowElements[4]).text()).toBe("Add");
        expect($(rowElements[5]).text()).toBe("Apply");
        expect($(rowElements[6]).text()).toBe("Environments");
        expect($(rowElements[7]).text()).toBe("Apply");
      });

      it('should disable the buttons if agents are not selected', function () {
        var rowElements = $root.find('.agent-button-group button');
        expect(rowElements[0].disabled).toBe(true);
        expect(rowElements[1].disabled).toBe(true);
        expect(rowElements[2].disabled).toBe(true);
        expect(rowElements[3].disabled).toBe(true);
        expect(rowElements[6].disabled).toBe(true);
      });

      it('should enable the buttons if at least one agent is selected', function () {
        var isAnyAgentSelected = m.prop(true);
        mount(vm, isAnyAgentSelected);
        var rowElements = $root.find('.agent-button-group button');

        expect(rowElements[0].disabled).toBe(false);
        expect(rowElements[1].disabled).toBe(false);
        expect(rowElements[2].disabled).toBe(false);
        expect(rowElements[3].disabled).toBe(false);
        expect(rowElements[5].disabled).toBe(false);
      });

    });

    var mount = function (vm, isAnyAgentSelected) {
      m.mount(root,
          m.component(ButtonRowWidget,
              {
                isAnyAgentSelected:     isAnyAgentSelected,
                dropdown:               vm.dropdown,
                toggleDropDownState:    toggleDropDownState,
                dropDownState:          dropDownState,
                'selectedAgents':       selectedAgents,
                'onDisable':            disableAgents,
                'onEnable':             enableAgents,
                'onDelete':             deleteAgents,
                'onResourcesUpdate':    updateResources,
                'onEnvironmentsUpdate': updateEnvironments
              })
      );
      m.redraw(true);
    };

    var unmount = function () {
      m.mount(root, null);
      m.redraw(true);
    };

    var toggleDropDownState = function () {};

    var dropDownState = function (name) {
      return false;
    };

    var json = function () {
      return [
        {
          "_links":             {
            "self": {
              "href": "https://ci.example.com/go/api/agents/uuid-1"
            },
            "doc":  {
              "href": "http://api.go.cd/#agents"
            },
            "find": {
              "href": "https://ci.example.com/go/api/agents/:uuid"
            }
          },
          "uuid":               "uuid-1",
          "hostname":           "in-john.local",
          "ip_address":         "10.12.2.200",
          "sandbox":            "usr/local/foo",
          "operating_system":   "Linux",
          "free_space":         "unknown",
          "agent_config_state": "Enabled",
          "agent_state":        "Missing",
          "build_state":        "Unknown",
          "resources":          [
            "Firefox"
          ],
          "environments":       []
        }
      ];
    };
  });
});
