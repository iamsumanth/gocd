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

define(["jquery", "mithril", "views/agents/environment_checkbox_widget", "models/agents/tri_state_checkbox"], function ($, m, EnvironmentCheckboxWidget, EnvironmentCheckbox) {
  describe("Environment Checkbox Widget", function () {
    var $root = $('#mithril-mount-point'), root = $root.get(0);

    it('should have a environment checkbox', function () {
      var environment = new EnvironmentCheckbox('Firefox', true, false);
      mount(environment);
      var environment = $.find('input')[0];
      expect(environment.value).toBe('Firefox');
    });

    it('should check the box depending upon the environment isChecked field', function () {
      var environment = new EnvironmentCheckbox('Firefox', true, false);
      mount(environment);
      var environment = $.find('input')[0];
      expect(environment.checked).toBe(true);
    });

    it('should select the box as indeterminate depending upon the environment isIndeterminate field', function () {
      var environment = new EnvironmentCheckbox('Firefox', false, true);
      mount(environment);
      var environment = $.find('input')[0];
      expect(environment.indeterminate).toBe(true);
    });

    var mount = function (environment) {
      m.mount(root,
        m.component(EnvironmentCheckboxWidget, {environment:environment})
      );
      m.redraw(true);
    };
  });
});
