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
describe("ElasticProfilesWidget", function () {

  var $ = require("jquery");
  var m = require("mithril");

  require('jasmine-jquery');

  var ElasticProfilesWidget = require("views/elastic_profiles/elastic_profiles_widget");
  var PluginInfos           = require('models/pipeline_configs/plugin_infos');
  var Modal                 = require('views/shared/new_modal');

  var $root = $('#mithril-mount-point'), root = $root.get(0);

  var profileJSON = {
    "id":         "unit-tests",
    "plugin_id":  "cd.go.contrib.elastic-agent.docker",
    "properties": [
      {
        "key":   "Image",
        "value": "gocdcontrib/gocd-dev-build"
      },
      {
        "key":   "Environment",
        "value": "JAVA_HOME=/opt/java\nMAKE_OPTS=-j8"
      }
    ]
  };

  var allProfilesJSON = {
    "_embedded": {
      "profiles": [profileJSON]
    }
  };

  var dockerPluginInfoJSON = {
    "id":                          "cd.go.contrib.elastic-agent.docker",
    "name":                        "Docker Elastic Agent Plugin",
    "version":                     "0.5",
    "type":                        "elastic-agent",
    "pluggable_instance_settings": {
      "configurations": [
        {
          "key":      "Image",
          "metadata": {
            "secure":   false,
            "required": true
          }
        },
        {
          "key":      "Command",
          "metadata": {
            "secure":   false,
            "required": false
          }
        },
        {
          "key":      "Environment",
          "metadata": {
            "secure":   false,
            "required": false
          }
        }
      ],
      "view":           {
        "template": "<div></div>"
      }
    },
    "image":                       {
      "content_type": "image/svg+xml",
      "data":         "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48ZyBmaWxsPSIjMDE5QkM2Ij48cGF0aCBkPSJNMTI0LjggNTIuMWMtNC4zLTIuNS0xMC0yLjgtMTQuOC0xLjQtLjYtNS4yLTQtOS43LTgtMTIuOWwtMS42LTEuMy0xLjQgMS42Yy0yLjcgMy4xLTMuNSA4LjMtMy4xIDEyLjMuMyAyLjkgMS4yIDUuOSAzIDguMy0xLjQuOC0yLjkgMS45LTQuMyAyLjQtMi44IDEtNS45IDItOC45IDJoLTYuN3YtMTQuMWgtMTN2LTI1aC0xNXYxMmgtMjV2MTNoLTEzdjE0aC0xMS4ybC0uMiAxLjVjLS41IDYuNC4zIDEyLjYgMyAxOC41bDEuMSAyLjIuMS4yYzcuOSAxMy40IDIxLjcgMTkgMzYuOCAxOSAyOS4yIDAgNTMuMy0xMy4xIDY0LjMtNDAuNiA3LjQuNCAxNS0xLjggMTguNi04LjlsLjktMS44LTEuNi0xem0tOTYuOC0xMy4xaDEwdjExaC0xMHYtMTF6bTEzLjEgNDQuMmMwIDEuNy0xLjQgMy4xLTMuMSAzLjEtMS43IDAtMy4xLTEuNC0zLjEtMy4xIDAtMS43IDEuNC0zLjEgMy4xLTMuMSAxLjcuMSAzLjEgMS40IDMuMSAzLjF6bS0xMy4xLTMxLjJoMTB2MTFoLTEwdi0xMXptLTEzIDBoMTF2MTFoLTExdi0xMXptMjcuNyA1MC4yYy0xNS44LS4xLTI0LjMtNS40LTMxLjMtMTIuNCAyLjEuMSA0LjEuMiA1LjkuMiAxLjYgMCAzLjIgMCA0LjctLjEgMy45LS4yIDcuMy0uNyAxMC4xLTEuNSAyLjMgNS4zIDYuNSAxMC4yIDE0IDEzLjhoLTMuNHptOC4zLTM5LjJoLTExdi0xMWgxMXYxMXptMC0xM2gtMTF2LTExaDExdjExem0xMyAxM2gtMTF2LTExaDExdjExem0wLTEzaC0xMXYtMTFoMTF2MTF6bTAtMTNoLTExdi0xMWgxMXYxMXptMTMgMjZoLTExdi0xMWgxMXYxMXpNMzguOCA4MS4yYy0uMi0uMS0uNS0uMi0uOC0uMi0xLjIgMC0yLjIgMS0yLjIgMi4yIDAgMS4yIDEgMi4yIDIuMiAyLjJzMi4yLTEgMi4yLTIuMmMwLS4zLS4xLS42LS4yLS44LS4yLjMtLjQuNS0uOC41LS41IDAtLjktLjQtLjktLjkuMS0uNC4zLS43LjUtLjh6Ii8+PC9nPjwvc3ZnPgo="
    }
  };

  var allPluginInfosJSON = {
    "_embedded": {
      "plugin_info": [
        {
          "id":      "cd.go.contrib.elastic-agent.docker",
          "name":    "Docker Elastic Agent Plugin",
          "version": "0.5",
          "type":    "elastic-agent",
          "image":   {
            "content_type": "image/svg+xml",
            "data":         "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48ZyBmaWxsPSIjMDE5QkM2Ij48cGF0aCBkPSJNMTI0LjggNTIuMWMtNC4zLTIuNS0xMC0yLjgtMTQuOC0xLjQtLjYtNS4yLTQtOS43LTgtMTIuOWwtMS42LTEuMy0xLjQgMS42Yy0yLjcgMy4xLTMuNSA4LjMtMy4xIDEyLjMuMyAyLjkgMS4yIDUuOSAzIDguMy0xLjQuOC0yLjkgMS45LTQuMyAyLjQtMi44IDEtNS45IDItOC45IDJoLTYuN3YtMTQuMWgtMTN2LTI1aC0xNXYxMmgtMjV2MTNoLTEzdjE0aC0xMS4ybC0uMiAxLjVjLS41IDYuNC4zIDEyLjYgMyAxOC41bDEuMSAyLjIuMS4yYzcuOSAxMy40IDIxLjcgMTkgMzYuOCAxOSAyOS4yIDAgNTMuMy0xMy4xIDY0LjMtNDAuNiA3LjQuNCAxNS0xLjggMTguNi04LjlsLjktMS44LTEuNi0xem0tOTYuOC0xMy4xaDEwdjExaC0xMHYtMTF6bTEzLjEgNDQuMmMwIDEuNy0xLjQgMy4xLTMuMSAzLjEtMS43IDAtMy4xLTEuNC0zLjEtMy4xIDAtMS43IDEuNC0zLjEgMy4xLTMuMSAxLjcuMSAzLjEgMS40IDMuMSAzLjF6bS0xMy4xLTMxLjJoMTB2MTFoLTEwdi0xMXptLTEzIDBoMTF2MTFoLTExdi0xMXptMjcuNyA1MC4yYy0xNS44LS4xLTI0LjMtNS40LTMxLjMtMTIuNCAyLjEuMSA0LjEuMiA1LjkuMiAxLjYgMCAzLjIgMCA0LjctLjEgMy45LS4yIDcuMy0uNyAxMC4xLTEuNSAyLjMgNS4zIDYuNSAxMC4yIDE0IDEzLjhoLTMuNHptOC4zLTM5LjJoLTExdi0xMWgxMXYxMXptMC0xM2gtMTF2LTExaDExdjExem0xMyAxM2gtMTF2LTExaDExdjExem0wLTEzaC0xMXYtMTFoMTF2MTF6bTAtMTNoLTExdi0xMWgxMXYxMXptMTMgMjZoLTExdi0xMWgxMXYxMXpNMzguOCA4MS4yYy0uMi0uMS0uNS0uMi0uOC0uMi0xLjIgMC0yLjIgMS0yLjIgMi4yIDAgMS4yIDEgMi4yIDIuMiAyLjJzMi4yLTEgMi4yLTIuMmMwLS4zLS4xLS42LS4yLS44LS4yLjMtLjQuNS0uOC41LS41IDAtLjktLjQtLjktLjkuMS0uNC4zLS43LjUtLjh6Ii8+PC9nPjwvc3ZnPgo="
          }
        }
      ]
    }
  };

  beforeEach(function () {
    jasmine.Ajax.install();
    jasmine.Ajax.stubRequest('/go/api/elastic/profiles', undefined, 'GET').andReturn({
      responseText: JSON.stringify(allProfilesJSON),
      status:       200
    });

    jasmine.Ajax.stubRequest('/go/api/admin/plugin_info?type=elastic-agent', undefined, 'GET').andReturn({
      responseText: JSON.stringify(allPluginInfosJSON),
      status:       200
    });

    jasmine.Ajax.stubRequest('/go/api/admin/plugin_info/' + dockerPluginInfoJSON.id, undefined, 'GET').andReturn({
      responseText: JSON.stringify(dockerPluginInfoJSON),
      status:       200
    });

    PluginInfos.init('elastic-agent');

    m.mount(root, m(ElasticProfilesWidget));
    m.redraw(true);
  });

  afterEach(function () {
    jasmine.Ajax.uninstall();
    PluginInfos([]);

    m.mount(root, null);
    m.redraw(true);

    expect($('.new-modal-container .reveal')).not.toExist('Did you forget to close the modal before the test?');
  });

  describe("list all profiles", function () {
    it("should render a list of all profiles", function () {
      expect($root.find('.profile-id')).toContainText(profileJSON.id);
      expect($root.find('.plugin-id')).toContainText(profileJSON.plugin_id);
    });

    it("should render error if index call fails", function () {
      jasmine.Ajax.stubRequest('/go/api/elastic/profiles').andReturn({
        responseText: JSON.stringify({message: 'Boom!'}),
        status:       401
      });

      m.mount(root, m(ElasticProfilesWidget));
      m.redraw(true);

      expect($root.find('.alert.callout')).toContainText('Boom!');
    });
  });

  describe("add a new profile", function () {
    afterEach(Modal.destroyAll);

    it("should popup a new modal to allow adding a profile", function () {
      expect($root.find('.reveal:visible')).not.toBeInDOM();
      $root.find('.add-profile').click();
      m.redraw(true);
      expect($('.reveal:visible')).toBeInDOM();
      expect($('.reveal:visible input[data-prop-name]')).not.toBeDisabled();
    });

    it("should allow saving a profile if save is successful", function () {
      $root.find('.add-profile').click();
      m.redraw(true);

      expect($('.reveal:visible .modal-buttons').find('.save')).toBeDisabled();

      var profileId = $('.reveal:visible .modal-body').find('[data-prop-name="id"]').val("unit-test");
      profileId.val("unit-test");
      var e = $.Event('input', {currentTarget: profileId.get(0)});
      profileId.trigger(e);

      var pluginId = $('.reveal:visible .modal-body').find('[data-prop-name="pluginId"]').val(dockerPluginInfoJSON.id);
      pluginId.val(dockerPluginInfoJSON.id);
      e = $.Event('input', {currentTarget: pluginId.get(0)});
      pluginId.trigger(e);

      m.redraw(true);

      expect($('.reveal:visible .modal-buttons').find('.save')).not.toBeDisabled();

      jasmine.Ajax.stubRequest('/go/api/elastic/profiles', undefined, 'POST').andReturn({
        responseText: JSON.stringify({data: profileJSON}),
        status:       200
      });

      $('.reveal:visible .modal-buttons').find('.save').click();
      m.redraw(true);

      var request = jasmine.Ajax.requests.at(jasmine.Ajax.requests.count() - 2);
      expect(request.url).toBe('/go/api/elastic/profiles');
      expect(request.method).toBe('POST');

      expect($('.success')).toContainText('The profile unit-test was created successfully');
    });

    it("should display error message", function () {
      $root.find('.add-profile').click();
      m.redraw(true);

      var profileId = $('.reveal:visible .modal-body').find('[data-prop-name="id"]').val("unit-test");
      profileId.val("unit-test");
      var e = $.Event('input', {currentTarget: profileId.get(0)});

      profileId.trigger(e);

      var pluginId = $('.reveal:visible .modal-body').find('[data-prop-name="pluginId"]').val(dockerPluginInfoJSON.id);
      pluginId.val(dockerPluginInfoJSON.id);
      e = $.Event('input', {currentTarget: pluginId.get(0)});

      pluginId.trigger(e);
      m.redraw(true);

      jasmine.Ajax.stubRequest('/go/api/elastic/profiles', undefined, 'POST').andReturn({
        responseText: JSON.stringify({message: 'Boom!'}),
        status:       401
      });

      $('.reveal:visible .modal-buttons').find('.save').click();
      m.redraw(true);

      var request = jasmine.Ajax.requests.at(jasmine.Ajax.requests.count() - 1);
      expect(request.url).toBe('/go/api/elastic/profiles');
      expect(request.method).toBe('POST');

      expect($('.alert')).toContainText('Boom!');
    });
  });

  describe("edit an existing profile", function () {
    afterEach(Modal.destroyAll);
    it("should popup a new modal to allow edditing a profile", function () {
      jasmine.Ajax.stubRequest('/go/api/elastic/profiles/' + profileJSON.id, undefined, 'GET').andReturn({
        responseText: JSON.stringify(profileJSON),
        status:       200
      });
      expect($root.find('.reveal:visible')).not.toBeInDOM();

      $root.find('.edit-profile').click();
      m.redraw(true);
      expect($('.reveal:visible')).toBeInDOM();
      expect($('.reveal:visible input[data-prop-name]')).toBeDisabled();
    });

    it("should display error message if fetching a profile fails", function () {
      jasmine.Ajax.stubRequest('/go/api/elastic/profiles/' + profileJSON.id, undefined, 'GET').andReturn({
        responseText: JSON.stringify({message: 'Boom!'}),
        status:       401
      });

      $root.find('.edit-profile').click();
      m.redraw(true);

      expect($('.alert')).toContainText('Boom!');
    });


    it("should keep the profile expanded while edit modal is open", function () {
      jasmine.Ajax.stubRequest('/go/api/elastic/profiles/' + profileJSON.id, undefined, 'GET').andReturn({
        responseText: JSON.stringify(profileJSON),
        status:       200
      });

      expect($root.find('.plugin-config-read-only')).not.toHaveClass('show');
      $root.find('.elastic-profile-header').click();
      m.redraw(true);
      expect($root.find('.plugin-config-read-only')).toHaveClass('show');

      $root.find('.edit-profile').click();
      m.redraw(true);

      $root.find('.reveal:visible .close-button span').click();
      m.redraw(true);
      expect($root.find('.plugin-config-read-only')).toHaveClass('show');
    });
  });

  describe("delete an existing profile", function () {
    afterEach(Modal.destroyAll);

    it("should show confirm modal when deleting a profile", function () {
      $('.delete-profile-confirm').click();
      m.redraw(true);
      expect($('.reveal:visible .modal-title')).toHaveText('Are you sure?');
    });

    it("should show success message when profile is deleted", function () {
      jasmine.Ajax.stubRequest('/go/api/elastic/profiles/' + profileJSON.id, undefined, 'DELETE').andReturn({
        responseText: JSON.stringify({message: 'Success!'}),
        status:       200
      });

      $('.delete-profile-confirm').click();
      m.redraw(true);
      $('.reveal:visible .delete-profile').click();
      m.redraw(true);

      expect($('.success')).toContainText('Success!');
    });

    it("should show error message when deleting profile fails", function () {
      jasmine.Ajax.stubRequest('/go/api/elastic/profiles/' + profileJSON.id, undefined, 'DELETE').andReturn({
        responseText: JSON.stringify({message: 'Boom!'}),
        status:       401
      });

      $('.delete-profile-confirm').click();
      m.redraw(true);
      $('.reveal:visible .delete-profile').click();
      m.redraw(true);

      expect($('.alert')).toContainText('Boom!');
    });
  });


});
