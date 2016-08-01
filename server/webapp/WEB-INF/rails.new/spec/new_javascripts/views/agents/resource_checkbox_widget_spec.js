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

define(["jquery", "mithril", "views/agents/resource_checkbox_widget", "models/agents/tri_state_checkbox"], function ($, m, ResourceCheckboxWidget, ResourceCheckBox) {
  describe("Resource Checkbox Widget", function () {
    var $root = $('#mithril-mount-point'), root = $root.get(0);

    it('should have a resource checkbox', function () {
      var resource = new ResourceCheckBox('Firefox', true, false);
      mount(resource);
      var resource = $.find('input')[0];
      expect(resource.value).toBe('Firefox');
    });

    it('should check the box depending upon the resource isChecked field', function () {
      var resource = new ResourceCheckBox('Firefox', true, false);
      mount(resource);
      var resource = $.find('input')[0];
      expect(resource.checked).toBe(true);
    });

    it('should select the box as indeterminate depending upon the resource isIndeterminate field', function () {
      var resource = new ResourceCheckBox('Firefox', false, true);
      mount(resource);
      var resource = $.find('input')[0];
      expect(resource.indeterminate).toBe(true);
    });

    var mount = function (resource) {
      m.mount(root,
        m.component(ResourceCheckboxWidget, {resource: resource})
      );
      m.redraw(true);
    };
  });
});
