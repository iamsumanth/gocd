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

define([
    'jquery', 'mithril', 'lodash',
    'helpers/form_helper', 'helpers/mithril_component_mixins',
    'js-routes',
    'models/agents/agents',
    'views/agents/agent_spa',
    'foundation.util.mediaQuery',
    'foundation.dropdownMenu',
    'foundation.responsiveToggle',
    'foundation.dropdown'
  ],
  function ($, m, _, f, ComponentMixins, JsRoutes, Agents, AgentsSPA) {
    describe("Agent SPA", function () {
      var $root = $('#mithril-mount-point'), root = $root.get(0);
      beforeAll(function () {
        jasmine.Ajax.install();//apiAgents
        jasmine.Ajax.stubRequest(/\/api\/agents/).andReturn({
          "responseText": JSON.stringify(agentsData),
          "status": 200
        });
        filterText = '';
        mount(filterText);
      });

      afterAll(function () {
        jasmine.Ajax.uninstall();
      });

      it('should show message after disabling the agents', function () {

        var agents_row      = $root.find('.all-agents');
        var agents_checkbox = agents_row.find("input[type='checkbox']");

        $(agents_checkbox[0]).click();
        m.redraw(true);

        var buttons = $root.find('.button.group-element');
        var message = $root.find('#message_pane');

        expect(message.text()).toBe('');
        buttons[1].click();
        m.redraw(true);
        expect(message.text()).toBe('Disabled 2 agent(s)');

      });

      it('should show message after enabling the agents', function () {
        mount(filterText);
        var agents_row      = $root.find('.all-agents');
        var agents_checkbox = agents_row.find("input[type='checkbox']");

        $(agents_checkbox[0]).click();
        m.redraw(true);

        var buttons = $root.find('.button.group-element');
        var message = $root.find('#message_pane');

        expect(message.text()).toBe('');
        buttons[2].click();
        m.redraw(true);
        expect(message.text()).toBe('Enabled 2 agent(s)');

      });

      it('should show message after deleting the agents', function () {
        mount(filterText);

        var agents_checkbox = $root.find('.all-agents').find("input[type='checkbox']");
        var delete_button   = $root.find('.button.group-element')[0];
        var message_pane    = $root.find('#message_pane');

        $(agents_checkbox[0]).click();
        m.redraw(true);

        expect(delete_button.disabled).toBe(false);
        delete_button.click();
        m.redraw(true);
        expect(message_pane.text()).toBe('Deleted 2 agent(s)');
        expect(delete_button.disabled).toBe(true);
      });

      it('should show message after updating resource of the agents', function () {

        mount(filterText);
        var agents_row = $root.find('.all-agents');
        var resource   = $root.find('#resources_list');
        var message    = $root.find('#message_pane');

        var agents_checkbox = agents_row.find("input[type='checkbox']");
        var new_resource    = resource.find('#new_resource');
        var apply_resource  = resource.find('button');

        $(agents_checkbox[0]).click();
        m.redraw(true);

        new_resource.val("Linux");
        apply_resource.click();
        m.redraw(true);
        expect(message.text()).toBe('Resource(s) modified on 2 agent(s)');
      });

      it('should show message after updating environment of the agents', function () {

        mount(filterText);
        var agents_row  = $root.find('.all-agents');
        var environment = $root.find('#environments_list');
        var message     = $root.find('#message_pane');


        var agents_checkbox      = agents_row.find("input[type='checkbox']");
        var environment_checkbox = environment.find("input[type='checkbox']");
        var apply_environment    = environment.find('button');

        $(agents_checkbox[0]).click();
        m.redraw(true);

        environment_checkbox.click();
        apply_environment.click();
        m.redraw(true);
        expect(message.text()).toBe('Environment(s) modified on 2 agent(s)');

      });


      it('should show only filtered agents after inserting filter text', function () {

        mount(filterText);
        var agents_row   = $root.find('.all-agents');
        var search_field = $root.find('#filter_agent')[0];

        var no_of_agents_on_page = agents_row.find('tbody tr');
        expect(no_of_agents_on_page.length).toBe(2);

        $(search_field).val('host-2').trigger('oninput');
        m.redraw(true);

        expect($(search_field).val()).toBe('host-2');
        no_of_agents_on_page = agents_row.find('tbody tr');
        expect(no_of_agents_on_page.length).toBe(1);

      });


      it('should not show any agent if filtered text not present on any agent', function () {

        mount(filterText);
        var agents_row   = $root.find('.all-agents');
        var search_field = $root.find('#filter_agent')[0];

        var no_of_agents_on_page = agents_row.find('tbody tr');
        expect(no_of_agents_on_page.length).toBe(2);

        $(search_field).val('invalidtextnotvalid').trigger('oninput');
        m.redraw(true);

        expect($(search_field).val()).toBe('invalidtextnotvalid');

        no_of_agents_on_page = agents_row.find('tbody tr');
        expect(no_of_agents_on_page.length).toBe(0);

      });

      it('should show all the agents after removing filter text', function () {

        mount('randomtext');
        var agents_row   = $root.find('.all-agents');
        var search_field = $root.find('#filter_agent')[0];

        var no_of_agents_on_page = agents_row.find('tbody tr');
        expect(no_of_agents_on_page.length).toBe(0);

        $(search_field).val('').trigger('oninput');
        m.redraw(true);

        no_of_agents_on_page = agents_row.find('tbody tr');
        expect(no_of_agents_on_page.length).toBe(2);

      });

      var mount = function (filterText) {
        m.mount(root, m.component(AgentsSPA(url, filterText, shouldPoll)));
        m.redraw(true);
      };

      var url         = JsRoutes.apiv2AgentsPath();
      var shouldPoll  = false;


      var agentsData = {
        "_embedded": {
          "agents": [
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
              "uuid": "dfdbe0b1-4521-4a52-ac2f-ca0cf6bdaa3e",
              "hostname": "host-1",
              "ip_address": "10.12.2.200",
              "sandbox": "",
              "operating_system": "",
              "free_space": "unknown",
              "agent_config_state": "Disabled",
              "agent_state": "Missing",
              "build_state": "Unknown",
              "resources": [
                "firefox"
              ],
              "environments": [
                "Dev",
                "Test"
              ]
            },
            {
              "_links": {
                "self": {
                  "href": "https://ci.example.com/go/api/agents/dfdbe0b1-aa31-4a52-ac42d-ca0cf6bdaa3e"
                },
                "doc": {
                  "href": "http://api.go.cd/#agents"
                },
                "find": {
                  "href": "https://ci.example.com/go/api/agents/:uuid"
                }
              },
              "uuid": "dfdbe0b1-aa31-4a52-ac42d-ca0cf6bdaa3e",
              "hostname": "host-2",
              "ip_address": "10.12.2.201",
              "sandbox": "usr/local/bin",
              "operating_system": "Linux",
              "free_space": "unknown",
              "agent_config_state": "Disabled",
              "agent_state": "Missing",
              "build_state": "Unknown",
              "resources": [
                "Chrome"
              ],
              "environments": [
                "Test"
              ]
            }
          ]
        }
      };

    });
  });