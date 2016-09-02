/*
 * Copyright 2016 ThoughtWorks, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define([
  'mithril', 'lodash', 'string-plus',
  'models/model_mixins',
  'models/agents/agents',
], function (m, _, s, Mixin, Agents) {
  describe('Agent Model', function () {

    function ajaxCall(agentData) {
      jasmine.Ajax.stubRequest(/\/api\/agents/).andReturn({
        "responseText": JSON.stringify({
          "_embedded": {
            "agents": agentData
          }
        }),
        "status":       200
      });
    }

    beforeAll(function () {
      jasmine.Ajax.install();
      ajaxCall(agentData);
    });

    afterAll(function () {
      jasmine.Ajax.uninstall();
    });

    it("should deserialize from json", function () {
      var agent = Agents.Agent.fromJSON(agentData[0]);
      expect(agent.uuid()).toBe('uuid-1');
      expect(agent.hostname()).toBe('host-1');
      expect(agent.ipAddress()).toBe('10.12.2.201');
      expect(agent.sandbox()).toBe('/var/lib/go-agent-2');
      expect(agent.operatingSystem()).toBe('Linux');
      expect(agent.freeSpace()).toBe('111902543872');
      expect(agent.agentConfigState()).toBe('Enabled');
      expect(agent.agentState()).toBe('Missing');
      expect(agent.buildState()).toBe('Unknown');
      expect(agent.resources()).toEqual(['linux', 'java']);
      expect(agent.environments()).toEqual(['staging', 'perf']);
    });

    it("should serialize to JSON", function () {
      var agent = Agents.Agent.fromJSON(agentData[0]);

      expect(JSON.parse(JSON.stringify(agent, s.snakeCaser))).toEqual({
        hostname:           'host-1',
        resources:          ['linux', 'java'],
        environments:       ['staging', 'perf'],
        agent_config_state: 'Enabled' // eslint-disable-line camelcase
      });
    });


    it("should give the freeSpace in human readable format", function () {
      expect(new Agents.Agent({freeSpace: 1024}).readableFreeSpace()).toBe('1 KB');
      expect(new Agents.Agent({freeSpace: 2048526}).readableFreeSpace()).toBe('1.95 MB');
      expect(new Agents.Agent({freeSpace: 2199023255552}).readableFreeSpace()).toBe('2 TB');
      expect(new Agents.Agent({freeSpace: 'snafu'}).readableFreeSpace()).toBe('Unknown');
    });

    describe("agent status", function () {
      it("should be pending when agentConfigState is Pending", function () {
        var agent = new Agents.Agent({agentConfigState: 'Pending'});
        expect(agent.status()).toBe('Pending');
      });

      it("should be 'Disabled (Building)' when agentConfigState is 'Disabled' and buildState is 'Building'", function () {
        var agent = new Agents.Agent({agentConfigState: 'Disabled', buildState: 'Building'});
        expect(agent.status()).toBe('Disabled (Building)');
      });

      it("should be 'Disabled (Cancelled)' when agentConfigState is 'Disabled' and buildState is 'Cancelled'", function () {
        var agent = new Agents.Agent({agentConfigState: 'Disabled', buildState: 'Cancelled'});
        expect(agent.status()).toBe('Disabled (Cancelled)');
      });

      it("should be 'Disabled' when agentConfigState is 'Disabled'", function () {
        var agent = new Agents.Agent({agentConfigState: 'Disabled'});
        expect(agent.status()).toBe('Disabled');
      });

      it("should be 'Building (Cancelled)' when agentState is 'Building' and buildState is 'Cancelled'", function () {
        var agent = new Agents.Agent({agentState: 'Building', buildState: 'Cancelled'});
        expect(agent.status()).toBe('Building (Cancelled)');
      });

      it("should be 'Building' when agentState is 'Building'", function () {
        var agent = new Agents.Agent({agentState: 'Building'});
        expect(agent.status()).toBe('Building');
      });
    });

    it('should give the agents object', function () {
      var agents = Agents.all();
      expect(agents().countAgent()).toBe(5);
    });

    describe('agent matches', function () {
      it("should tell whether the specified string matches the agent's information", function () {
        var agent = Agents.Agent.fromJSON(agentData[0]);
        expect(agent.matches('host-1')).toBe(true);
        expect(agent.matches("Linux")).toBe(true);
        expect(agent.matches("10.12.2.201")).toBe(true);
        expect(agent.matches("linux")).toBe(true);
        expect(agent.matches("perf")).toBe(true);

        expect(agent.matches("invalid-search")).toBe(false);
      });
    });

    describe('sort the agents', function () {
      it("should sort based on OS", function () {
        var agents = Agents.all();
        var sortedAgents = agents().sortBy('operatingSystem', 'asc');
        expect(sortedAgents.toJSON()[0].uuid()).toBe("uuid-1");
        expect(sortedAgents.toJSON()[1].uuid()).toBe("uuid-5");
      });

      it('should sort based on hostname', function () {
        var agents                  = Agents.all();
        var sortedAgents            = agents().sortBy('hostname');
        var hostnamesOfSortedAgents = sortedAgents.collectAgentProperty('hostname');
        expect(hostnamesOfSortedAgents).toEqual(['host-0', 'host-1', 'host-10', 'host-2', 'host-4'])
      });

      it("should sort based on agent location", function () {
        var agents = Agents.all();
        var sortedAgents = agents().sortBy('sandbox', 'asc');
        expect(sortedAgents.toJSON()[0].uuid()).toBe("uuid-2");
        expect(sortedAgents.toJSON()[1].uuid()).toBe("uuid-1");
      });

      it("should sort based on agent ip address", function () {
        var agents = Agents.all();
        var sortedAgents = agents().sortBy('ipAddress', 'asc');
        expect(sortedAgents.toJSON()[0].uuid()).toBe("uuid-2");
        expect(sortedAgents.toJSON()[1].uuid()).toBe("uuid-1");
      });

      it("should sort based on agent status", function () {
        var agents = Agents.all();
        var sortedAgents = agents().sortBy('agentState', 'asc');
        expect(sortedAgents.toJSON()[0].uuid()).toBe("uuid-2");
        expect(sortedAgents.toJSON()[1].uuid()).toBe("uuid-5");
        expect(sortedAgents.toJSON()[2].uuid()).toBe("uuid-4");
        expect(sortedAgents.toJSON()[3].uuid()).toBe("uuid-1");
        expect(sortedAgents.toJSON()[4].uuid()).toBe("uuid-3");
      });

      it("should sort based on agent's free space", function () {
        var agents = Agents.all();
        var sortedAgents = agents().sortBy('freeSpace', 'asc');
        expect(sortedAgents.toJSON()[0].uuid()).toBe("uuid-3");
        expect(sortedAgents.toJSON()[1].uuid()).toBe("uuid-1");
        expect(sortedAgents.toJSON()[2].uuid()).toBe("uuid-2");
      });

      it("should sort based on agent's resources", function () {
        var agents = Agents.all();
        var sortedAgents = agents().sortBy('resources', 'asc');
        expect(sortedAgents.toJSON()[0].uuid()).toBe("uuid-4");
        expect(sortedAgents.toJSON()[1].uuid()).toBe("uuid-5");
        expect(sortedAgents.toJSON()[2].uuid()).toBe("uuid-2");
        expect(sortedAgents.toJSON()[3].uuid()).toBe("uuid-1");
        expect(sortedAgents.toJSON()[4].uuid()).toBe("uuid-3");
      });

      it("should sort based on agent's environments", function () {
        var agents = Agents.all();
        var sortedAgents = agents().sortBy('environments', 'asc');
        expect(sortedAgents.toJSON()[0].uuid()).toBe("uuid-2");
        expect(sortedAgents.toJSON()[1].uuid()).toBe("uuid-5");
        expect(sortedAgents.toJSON()[2].uuid()).toBe("uuid-4");
        expect(sortedAgents.toJSON()[3].uuid()).toBe("uuid-3");
        expect(sortedAgents.toJSON()[4].uuid()).toBe("uuid-1");
      });
    });

    var agentData = [
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
        "uuid":               'uuid-1',
        "hostname":           "host-1",
        "ip_address":         "10.12.2.201",
        "sandbox":            "/var/lib/go-agent-2",
        "operating_system":   "Linux",
        "free_space":         "111902543872",
        "agent_config_state": "Enabled",
        "agent_state":        "Missing",
        "build_state":        "Unknown",
        "resources":          [
          "linux", "java"
        ],
        "environments":       [
          "staging", "perf"
        ]
      },
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
        "uuid":               'uuid-2',
        "hostname":           "host-4",
        "ip_address":         "10.12.2.200",
        "sandbox":            "/var/lib/go-agent-1",
        "operating_system":   "Windows",
        "free_space":         "Unknown",
        "agent_config_state": "Enabled",
        "agent_state":        "Pending",
        "build_state":        "Unknown",
        "resources":          ["1111", "2222", "3333"],
        "environments":       []
      },
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
        "uuid":               'uuid-3',
        "hostname":           "host-2",
        "ip_address":         "10.12.2.202",
        "sandbox":            "/var/lib/go-agent-3",
        "operating_system":   "Windows",
        "free_space":         "0",
        "agent_config_state": "Enabled",
        "agent_state":        "Missing",
        "build_state":        "Unknown",
        "resources":          ["zzzz"],
        "environments":       ['prod']
      },
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
        "uuid":               'uuid-4',
        "hostname":           "host-0",
        "ip_address":         "10.12.2.203",
        "sandbox":            "/var/lib/go-agent-4",
        "operating_system":   "Windows",
        "free_space":         "unknown",
        "agent_config_state": "Enabled",
        "agent_state":        "LostContact",
        "build_state":        "Unknown",
        "resources":          [],
        "environments":       ['ci']
      },
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
        "uuid":               'uuid-5',
        "hostname":           "host-10",
        "ip_address":         "10.12.2.204",
        "sandbox":            "/var/lib/go-agent-5",
        "operating_system":   "Mac OS X",
        "free_space":         "unknown",
        "agent_config_state": "Enabled",
        "agent_state":        "Pending",
        "build_state":        "Unknown",
        "resources":          [],
        "environments":       []
      }
    ];
  });
});
