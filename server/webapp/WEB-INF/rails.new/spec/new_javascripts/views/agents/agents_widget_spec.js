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

define(["jquery", "mithril", 'models/agents/agents', "views/agents/agents_widget"], function ($, m, Agents, AgentsWidget) {
  describe("Agents Widget", function () {

    var $root = $('#mithril-mount-point'), root = $root.get(0);

    var route = function () {
      m.route.mode = "hash";
      m.route(root, '',
        {
          '':                  m.component(AgentsWidget),
          '/:sortBy/:orderBy': m.component(AgentsWidget)
        }
      );
      m.route('');
      m.redraw(true);
    };

    var unmount = function () {
      m.route('');
      m.route.mode = "search";
      m.mount(root, null);
      m.redraw(true);
    };

    var clearTimeouts = function () {
      var timeoutId = window.setTimeout(function () {
      }, 0);
      while (timeoutId--) {
        window.clearTimeout(timeoutId);
      }
    };

    beforeAll(function () {
      jasmine.Ajax.install();
      jasmine.Ajax.stubRequest(/\/api\/agents/).andReturn({
        "responseText": JSON.stringify(agentsData),
        "status":       200
      });
      route();
    });

    afterAll(function () {
      unmount();
      clearTimeouts();
      jasmine.Ajax.uninstall();
    });
    
    beforeEach(function () {
      m.route('');
      m.redraw(true);
    });

    it('should contain the agents state count information', function () {
      var agentStateCount = $root.find('.search-summary')[0];
      var stateCountInfo  = "Total2Pending0Enabled0Disabled2";
      expect($(agentStateCount).text()).toBe(stateCountInfo);
    });

    it('should contain the agent rows equal to the number of agents', function () {
      var agentRows = $root.find('table tbody tr');
      expect(agentRows.length).toBe(2);
    });

    it('should contain the agent row information', function () {
      var agentInfo      = $root.find('table tbody tr')[0];
      var firstAgentInfo = $(agentInfo).find('td');
      expect(firstAgentInfo.length).toBe(9);
      expect($(firstAgentInfo[0]).html()).toBe('<input type="checkbox">');
      expect($(firstAgentInfo[1]).text()).toBe('host-1');
      expect($(firstAgentInfo[2]).text()).toBe('usr/local/foo');
      expect($(firstAgentInfo[3]).text()).toBe('Linux');
      expect($(firstAgentInfo[4]).text()).toBe('10.12.2.200');
      expect($(firstAgentInfo[5]).text()).toBe('Disabled');
      expect($(firstAgentInfo[6]).text()).toBe('Unknown');
      expect($(firstAgentInfo[7]).text()).toBe('Firefox');
      expect($(firstAgentInfo[8]).text()).toBe('Dev, Test');
    });

    it('should select all the agents when selectAll checkbox is checked', function () {
      var allBoxes          = $root.find('tbody :checkbox');
      var selectAllCheckbox = $root.find('thead :checkbox');

      expect(selectAllCheckbox[0].checked).toBe(false);
      expect(allBoxes[0].checked).toBe(false);
      expect(allBoxes[1].checked).toBe(false);

      $(selectAllCheckbox).click();
      m.redraw(true);

      expect(selectAllCheckbox[0].checked).toBe(true);
      expect(allBoxes[0].checked).toBe(true);
      expect(allBoxes[1].checked).toBe(true);

      toggleSelectAllCheckbox();
    });

    it('should check select all checkbox on selecting all the checkboxes', function () {
      var allBoxes          = $root.find('tbody :checkbox');
      var selectAllCheckbox = $root.find('thead :checkbox');

      expect(selectAllCheckbox[0].checked).toBe(false);
      expect(allBoxes[0].checked).toBe(false);

      $(allBoxes[0]).click();
      $(allBoxes[1]).click();
      m.redraw(true);

      expect(selectAllCheckbox[0].checked).toBe(true);
      expect(allBoxes[0].checked).toBe(true);
      expect(allBoxes[1].checked).toBe(true);
    });

    it('should hide all dropdown on click of the body', function () {
      var selectAllCheckbox = $root.find('thead :checkbox');
      $(selectAllCheckbox).click();
      m.redraw(true);

      var resourceButton = $root.find("button:contains('Resources')");
      resourceButton.click();
      m.redraw(true);

      expect($(resourceButton).parent().attr('class')).toContain('is-open');

      var body = $root.find('.search-panel');
      $(body).click();
      m.redraw(true);

      expect($(resourceButton).parent().attr('class')).not.toContain('is-open');
    });

    it('should not hide dropdown on click of dropdown list', function () {
      var selectAllCheckbox = $root.find('thead :checkbox');

      selectAllCheckbox.click();

      var resourceButton = $root.find("button:contains('Resources')");
      $(resourceButton).click();
      m.redraw(true);

      expect($(resourceButton).parent().attr('class')).toContain('is-open');

      $(resourceButton).parent().click();

      expect($(resourceButton).parent().attr('class')).toContain('is-open');

      var disableButton = $root.find("button:contains('Disable')");
      $(disableButton).click();
    });

    it('should show message after disabling the agents', function () {
      var agentsCheckbox = $root.find('.go-table thead tr input[type="checkbox"]');

      $(agentsCheckbox[0]).click();
      m.redraw(true);

      var disableButton = $root.find("button:contains('Disable')");
      var message       = $root.find('.alert-box');
      expect(message.length).toBe(0);
      $(disableButton).click();
      m.redraw(true);

      message = $root.find('.callout');
      expect(message.text()).toBe('Disabled 2 agents');
    });

    it('should show message after enabling the agents', function () {
      var agentsCheckbox = $root.find('.go-table thead tr input[type="checkbox"]');

      $(agentsCheckbox[0]).click();
      m.redraw(true);

      var buttons = $root.find('.agent-button-group button');
      var message = $root.find('.callout');

      expect(message.length).toBe(0);
      buttons[2].click();
      m.redraw(true);

      message = $root.find('.callout');
      expect(message.text()).toBe('Enabled 2 agents');
    });

    it('should show message after deleting the agents', function () {
      var agentsCheckbox = $root.find('.go-table thead tr input[type="checkbox"]');
      var deleteButton   = $root.find('.agent-button-group button')[0];

      $(agentsCheckbox[0]).click();
      m.redraw(true);

      expect(deleteButton.disabled).toBe(false);
      deleteButton.click();
      m.redraw(true);

      var message = $root.find('.callout');
      expect(message.text()).toBe('Deleted 2 agents');
      expect(deleteButton.disabled).toBe(true);
    });

    it('should show message after updating resource of the agents', function () {
      var resource = $root.find('.add-resource');

      var agentsCheckbox = $root.find('.go-table thead tr input[type="checkbox"]');
      var applyResource  = resource.find('button')[1];

      $(agentsCheckbox[0]).click();
      m.redraw(true);

      applyResource.click();
      m.redraw(true);

      var message = $root.find('.callout');
      expect(message.text()).toBe('Resources modified on 2 agents');
    });

    it('should show message after updating environment of the agents', function () {
      var environment      = $root.find('.env-dropdown');
      var agentsCheckbox   = $root.find('.go-table thead tr input[type="checkbox"]');
      var applyEnvironment = environment.find('button');

      $(agentsCheckbox[0]).click();
      m.redraw(true);

      applyEnvironment.click();
      m.redraw(true);

      var message = $root.find('.callout');
      expect(message.text()).toBe('Environments modified on 2 agents');
    });

    it('should show only filtered agents after inserting filter text', function () {
      var searchField       = $root.find('#filter-agent')[0];
      var agentsCountOnPage = $root.find('table tbody tr');
      expect(agentsCountOnPage.length).toBe(2);

      $(searchField).val('host-2').trigger('input');
      m.redraw(true);

      expect($(searchField).val()).toBe('host-2');
      agentsCountOnPage = $root.find('table tbody tr');
      expect(agentsCountOnPage.length).toBe(1);
    });

    it('should filter the agents based on filter text value', function () {
      var searchField = $root.find('#filter-agent')[0];
      $(searchField).val('').trigger('input');
      m.redraw(true);

      var agentsCountOnPage = $root.find('table tbody tr');
      expect(agentsCountOnPage.length).toBe(2);

      $(searchField).val('invalidtextnotvalid').trigger('input');
      m.redraw(true);

      expect($(searchField).val()).toBe('invalidtextnotvalid');

      agentsCountOnPage = $root.find('table tbody tr');
      expect(agentsCountOnPage.length).toBe(0);

      $(searchField).val('').trigger('input');
      m.redraw(true);

      expect($(searchField).val()).toBe('');

      agentsCountOnPage = $root.find('table tbody tr');
      expect(agentsCountOnPage.length).toBe(2);
    });

    it('should preserve the selection of agents during filter', function () {
      var searchField = $root.find('#filter-agent')[0];

      $(searchField).val('host-1').trigger('input');
      m.redraw(true);

      var allBoxes = $root.find('.go-table tbody tr input[type="checkbox"]');

      expect(allBoxes.length).toBe(1);
      $(allBoxes[0]).prop('checked', true).trigger('input');
      expect(allBoxes[0].checked).toBe(true);

      $(searchField).val('').trigger('input');
      m.redraw(true);

      allBoxes = $root.find('.go-table tbody tr input[type="checkbox"]');
      expect(allBoxes.length).toBe(2);
      expect(allBoxes[0].checked).toBe(true);
      expect(allBoxes[1].checked).toBe(false);
    });

    it('should sort the agents in ascending order based on hostname', function () {

      var agentNameHeader = $root.find("label:contains('Agent Name')");
      $(agentNameHeader).click();
      m.redraw(true);

      var hostnameCells = $root.find(".go-table tbody td:nth-child(2)");

      var hostNames = hostnameCells.map(function (i, cell) {
        return $(cell).text()
      }).toArray();

      expect(hostNames).toEqual(_.map(agents, 'hostname').sort());
    });

    it('should sort the agents in descending order based on hostname', function () {
      var agentNameHeader = $root.find("label:contains('Agent Name')");
      $(agentNameHeader).click();
      m.redraw(true);
      agentNameHeader = $root.find("label:contains('Agent Name')");
      $(agentNameHeader).click();
      m.redraw(true);

      var hostnameCells = $root.find(".go-table tbody td:nth-child(2)");

      var hostNames = hostnameCells.map(function (i, cell) {
        return $(cell).text()
      }).toArray();

      expect(hostNames).toEqual(_.reverse(_.map(agents, 'hostname').sort()));
    });

    it('should toggle the resources list on click of the resources button', function () {
      toggleSelectAllCheckbox();

      var resourceButton = $root.find('.agent-button-group button')[3];
      var resourcesList  = $root.find('.has-dropdown')[0];
      expect(resourcesList.classList).not.toContain('is-open');

      resourceButton.click();
      m.redraw(true);

      resourcesList  = $root.find('.has-dropdown')[0];
      expect(resourcesList.classList).toContain('is-open');

      resourceButton.click();
      m.redraw(true);
      expect(resourcesList.classList).not.toContain('is-open');

      toggleSelectAllCheckbox();
    });

    it('should toggle the environments list on click of the environments button', function () {
      toggleSelectAllCheckbox();

      var environmentButton = $root.find('.agent-button-group button')[6];
      var environmentsList  = $root.find('.has-dropdown')[1];
      expect(environmentsList.classList).not.toContain('is-open');

      environmentButton.click();
      m.redraw(true);
      environmentsList  = $root.find('.has-dropdown')[1];
      expect(environmentsList.classList).toContain('is-open');

      environmentButton.click();
      m.redraw(true);
      expect(environmentsList.classList).not.toContain('is-open');

      toggleSelectAllCheckbox();
    });

    it('should hide the resources list on click of the environments button', function () {
      toggleSelectAllCheckbox();

      var environmentButton = $root.find("button:contains('Environments')");
      var resourcesButton   = $root.find("button:contains('Resources')");
      var dropdown         = $root.find("button:contains('Resources')").parent()[0];

      resourcesButton.click();
      m.redraw(true);

      expect(dropdown.classList).toContain('is-open');

      environmentButton.click();
      m.redraw(true);

      expect(dropdown.classList).not.toContain('is-open');

      toggleSelectAllCheckbox();
    });

    it('should hide the environment list on click of the resource button', function () {
      toggleSelectAllCheckbox();
      var environmentButton = $root.find("button:contains('Environments')");
      var resourcesButton   = $root.find("button:contains('Resources')");
      var dropdown          = $root.find("button:contains('Environments')").parent()[0];

      environmentButton.click();
      m.redraw(true);

      expect(dropdown.classList).toContain('is-open');

      resourcesButton.click();
      m.redraw(true);

      expect(dropdown.classList).not.toContain('is-open');
      toggleSelectAllCheckbox();
    });


    var toggleSelectAllCheckbox = function () {
      var selectAllCheckbox = $root.find('thead :checkbox');
      $(selectAllCheckbox).click();
      m.redraw(true);
    };


    /* eslint-disable camelcase */
    var agents = [
      {
        "_links":             {
          "self": {
            "href": "https://ci.example.com/go/api/agents/dfdbe0b1-4521-4a52-ac2f-ca0cf6bdaa3e"
          },
          "doc":  {
            "href": "http://api.go.cd/#agents"
          },
          "find": {
            "href": "https://ci.example.com/go/api/agents/:uuid"
          }
        },
        "uuid":               "dfdbe0b1-4521-4a52-ac2f-ca0cf6bdaa3e",
        "hostname":           "host-1",
        "ip_address":         "10.12.2.200",
        "sandbox":            "usr/local/foo",
        "operating_system":   "Linux",
        "free_space":         "unknown",
        "agent_config_state": "Disabled",
        "agent_state":        "Missing",
        "build_state":        "Unknown",
        "resources":          [
          "Firefox"
        ],
        "environments":       [
          "Dev",
          "Test"
        ]
      },
      {
        "_links":             {
          "self": {
            "href": "https://ci.example.com/go/api/agents/dfdbe0b1-aa31-4a52-ac42d-ca0cf6bdaa3e"
          },
          "doc":  {
            "href": "http://api.go.cd/#agents"
          },
          "find": {
            "href": "https://ci.example.com/go/api/agents/:uuid"
          }
        },
        "uuid":               "dfdbe0b1-aa31-4a52-ac42d-ca0cf6bdaa3e",
        "hostname":           "host-2",
        "ip_address":         "10.12.2.201",
        "sandbox":            "usr/local/bin",
        "operating_system":   "Linux",
        "free_space":         "unknown",
        "agent_config_state": "Disabled",
        "agent_state":        "Missing",
        "build_state":        "Unknown",
        "resources":          [
          "Chrome"
        ],
        "environments":       [
          "Test"
        ]
      }
    ];

    var agentsData = {
      "_embedded": {
        "agents": agents
      }
    };

    /* eslint-enable camelcase */
  });
});
