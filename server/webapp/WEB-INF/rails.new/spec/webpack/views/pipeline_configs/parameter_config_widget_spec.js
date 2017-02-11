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

describe("Parameter Widget", function () {

  var $      = require("jquery");
  var m      = require('mithril');
  var Stream = require('mithril/stream');

  require("jasmine-jquery");

  var Parameters             = require("models/pipeline_configs/parameters");
  var ParametersConfigWidget = require("views/pipeline_configs/parameters_config_widget");

  var $root = $('#mithril-mount-point'), root = $root.get(0);
  var parameters;
  beforeEach(function () {
    parameters = Stream(new Parameters.fromJSON([
      {name: "COMMAND", value: "echo"}
    ]));

    m.mount(root,
      m(ParametersConfigWidget, {parameters: parameters})
    );
    m.redraw(true);

    var accordion = $root.find('.parameters .accordion-item > a').get(0);
    var evObj     = document.createEvent('MouseEvents');
    evObj.initEvent('click', true, false);
    accordion.onclick(evObj);
    m.redraw(true);
  });

  afterEach(function () {
    m.mount(root, null);
    m.redraw(true);
  });

  it("should display parameters", function () {
    var paramField = $root.find('.parameters div.parameter[data-parameter-name=COMMAND]');
    var paramName  = paramField.find("input[data-prop-name=name]");
    var paramValue = paramField.find("input[data-prop-name=value]");

    expect(paramName).toHaveValue("COMMAND");
    expect(paramValue).toHaveValue("echo");
  });

});
