##########################################################################
# Copyright 2017 ThoughtWorks, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
##########################################################################

class WebpackMiddleware
  def initialize(app)
    @app = app
    start_process
    at_exit { stop }
  end

  def call(env)
    if env['PATH_INFO'].start_with?('/assets/webpack/')
      start_process unless running?
    end

    @app.call(env)
  end

  private

  def child_process
    @child_process ||= begin
      process = ChildProcess.build('yarn', 'run', 'webpack-dev', '--', '--watch')
      process.io.inherit!
      process.cwd = Rails.root.to_s
      process
    end
  end

  def running?
    child_process.alive?
  end

  def start_process
    child_process.start
  end

  def stop
    return unless running?
    begin
      child_process.poll_for_exit(5)
    rescue ChildProcess::TimeoutError
      child_process.stop # tries increasingly harsher methods to kill the process.
    end
    @child_process = nil
  end

end
