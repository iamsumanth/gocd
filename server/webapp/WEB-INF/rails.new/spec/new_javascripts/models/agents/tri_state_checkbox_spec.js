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
  'mithril', 'lodash', 'string-plus',
  'models/model_mixins',
  'models/agents/tri_state_checkbox'
], function (m, _, s, Mixin, TriStateCheckbox) {
  describe('TriStateCheckbox (Resource/Environment) Model', function () {
    it("should contain the resource information", function () {
      var resource = new TriStateCheckbox('Linux', true, false);
      expect(resource.name()).toBe('Linux');
      expect(resource.checked()).toBe(true);
      expect(resource.indeterminate()).toBe(false);
    });

    it("should allow changing the checked state of the resource", function () {
      var resource = new TriStateCheckbox('Linux', false, false);
      expect(resource.name()).toBe('Linux');
      expect(resource.checked()).toBe(false);
      resource.checked(true);
      expect(resource.checked()).toBe(true);
    });

    it("should allow changing the indeterminate state of the resource", function () {
      var resource = new TriStateCheckbox('Linux', false, false);
      expect(resource.name()).toBe('Linux');
      expect(resource.indeterminate()).toBe(false);
      resource.indeterminate(true);
      expect(resource.indeterminate()).toBe(true);
    });
  });
});
