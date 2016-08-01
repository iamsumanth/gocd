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
    'models/agents/resources',
    "views/agents/resources_list_widget",
    "foundation.dropdown"],
  function ($, m, Resources, ResourcesListWidget) {
    describe("Resources List Widget", function () {
      var $root = $('#mithril-mount-point'), root = $root.get(0);

      beforeAll(function () {
        jasmine.Ajax.install();
        jasmine.Ajax.stubRequest(/\/api\/admin\/internal\/resources/).andReturn({
          "responseText": JSON.stringify(['Linux', 'Gauge', 'Java', 'Windows']),
          "status": 200
        });
        jasmine.Ajax.stubRequest(/\/api\/agents/).andReturn({"status": 304});

        var selectedAgents = [
          {
            uuid: '1',
            resources: function () { return ['Linux', 'Java']; }
          },
          {
            uuid: '2',
            resources: function () { return ['Gauge', 'Java']; }
          }
        ];
        Resources.init(selectedAgents);

        mount();
      });

      afterAll(function () {
        jasmine.Ajax.uninstall();
      });

      it('should contain all the resources checkbox', function () {
        var all_resources = $.find('#resources_list :checkbox');
        expect(all_resources.length).toBe(4);
        expect(all_resources[0].value).toBe('Linux');
        expect(all_resources[1].value).toBe('Gauge');
        expect(all_resources[2].value).toBe('Java');
        expect(all_resources[3].value).toBe('Windows');
      });

      it('should check resources that are present on all the agents', function () {
        var all_resources = $.find('#resources_list :checkbox');
        expect(all_resources[2].value).toBe('Java');
        expect(all_resources[2].checked).toBe(true);
      });

      it('should select resources as indeterminate that are present on some of the agents', function () {
        var all_resources = $.find('#resources_list :checkbox');
        expect(all_resources[0].value).toBe('Linux');
        expect(all_resources[0].indeterminate).toBe(true);

        expect(all_resources[1].value).toBe('Gauge');
        expect(all_resources[1].indeterminate).toBe(true);
      });

      it('should uncheck resources that are not present on any the agents', function () {
        var all_resources = $.find('#resources_list :checkbox');
        expect(all_resources[3].value).toBe('Windows');
        expect(all_resources[3].checked).toBe(false);
        expect(all_resources[3].indeterminate).toBe(false);
      });

      var mount = function () {
        m.mount(root, m.component(ResourcesListWidget, {
            'togglePolling': togglePolling,
            'fetch': fetch,
            'updateOperationMessage': updateOperationMessage,
            'selectAllViewModel': selectAllViewModel
          })
        );
        m.redraw(true);
      };

      var fetch                  = function () {
      };
      var updateOperationMessage = function () {
      };
      var selectAllViewModel     = {};
      var togglePolling          = function (toggleValue) {
      };
    });
  });
