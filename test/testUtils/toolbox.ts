import {
  build,
  print,
  filesystem,
  system,
  prompt,
  http,
  packageManager,
  patching,
  semver,
  strings
} from 'gluegun'
import { BoilerplateToolbox } from "../../src/types"
import { Toolbox } from "gluegun/build/domain/toolbox"
import { Plugin } from "gluegun/build/domain/plugin"
import attachTemplate from "gluegun/build/core-extensions/template-extension"
import * as sinon from 'sinon'
import attachIgnite = require('ignite-cli/build/extensions/ignite')
import Ora = require('ora')

const BoilerplateToolboxDefaultOptions = {
  cwd: null
}

export const createBoilerplateToolbox = (options = BoilerplateToolboxDefaultOptions): BoilerplateToolbox => {
  const cwd = options.cwd || process.cwd()
  const coreToolbox = new Toolbox()
  const plugin = new Plugin()
  plugin.name = 'ignite-hydrogen'
  const spinnerInstance = Ora('Hydrogen')
  const spinner = sinon.mock(spinnerInstance)
  spinner.start = () => null
  spinner.stop = () => null
  spinner.succeed = () => null
  const toolbox = {
    ...coreToolbox,
    name: 'HydrogenExample',
    useExpo: true,
    spinner,
    build,
    plugin,
    reactNative: undefined,
    print,
    filesystem,
    system,
    prompt,
    http,
    packageManager,
    patching,
    semver,
    strings
  }
  attachTemplate(toolbox)
  attachIgnite(toolbox)
  toolbox.ignite.setIgnitePluginPath(cwd)
  return {
    ...toolbox,
    ...options
  }
}
