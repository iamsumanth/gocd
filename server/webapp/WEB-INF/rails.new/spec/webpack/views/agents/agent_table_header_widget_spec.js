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
describe("Agent Table Header Widget", function () {

  var $ = require("jquery");
  var m = require("mithril");

  require('jasmine-jquery');

  var AgentsTableHeader = require("views/agents/agent_table_header");

  var $root = $('#mithril-mount-point'), root = $root.get(0);

  beforeEach(function () {
    route(true);
  });

  afterEach(function () {
    unmount();
  });

  var route = function (isUserAdmin) {
    m.route.prefix("#!");
    m.route(root, '', {
      '':                  agentTableHeaderComponent(isUserAdmin),
      '/:sortBy/:orderBy': agentTableHeaderComponent(isUserAdmin)
    });
    m.route.set('');
    console.warn("m.redraw ignores arguments in mithril 1.0") || m.redraw(true);
  };

  var unmount = function () {
    m.route.set('');
    m.route.prefix("#!");
    m.mount(root, null);
    console.warn("m.redraw ignores arguments in mithril 1.0") || m.redraw(true);
  };


  it('should select the checkbox depending upon the "checkboxValue" ', function () {
    var checkbox = $root.find('thead input')[0];
    expect(checkbox.checked).toBe(checkboxValue());
  });

  it('should not display checkbox for non-admin user', function () {
    expect($('thead input')).not.toBeInDOM();
  });


  it('should add the ascending css class to table header cell attribute when table is sorted ascending on the corresponding attribute', function () {
    m.route.set('/agentState/asc');
    console.warn("m.redraw ignores arguments in mithril 1.0") || m.redraw(true);
    var headerAttribute = $root.find("th:contains('Status') .sort");
    expect(headerAttribute).toHaveClass('asc');
  });


  it('should add the descending css class to table header cell attribute when table is sorted descending on the corresponding attribute', function () {
    m.route.set('/agentState/desc');
    console.warn("m.redraw ignores arguments in mithril 1.0") || m.redraw(true);
    var headerAttribute = $root.find("th:contains('Status') .sort");
    expect(headerAttribute).toHaveClass('desc');
  });

  var agentTableHeaderComponent = function (isUserAdmin) {
    return m(AgentsTableHeader, {
      onCheckboxClick: onCheckboxClick,
      checkboxValue:   checkboxValue,
      sortBy:          sortBy,
      isUserAdmin:     isUserAdmin
    });
  };

  var onCheckboxClick = function () {
  };

  var sortBy = function () {
  };

  var checkboxValue = function () {
    return false;
  };
});
