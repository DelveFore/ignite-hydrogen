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
import { read } from 'fs-jetpack'
import attachIgnite = require('ignite-cli/build/extensions/ignite')
import Ora = require('ora')

const BoilerplateToolboxDefaultOptions = {
  cwd: null
}

export const createBoilerplateToolbox = (options = BoilerplateToolboxDefaultOptions): BoilerplateToolbox => {
  const cwd = options.cwd || process.cwd()
  const coreToolbox = new Toolbox()
  const packageJson = read(cwd + '/package.json', 'json')
  const plugin = new Plugin()
  plugin.name = packageJson.name
  const toolbox = {
    ...coreToolbox,
    build,
    name: 'HydrogenExample',
    plugin,
    useExpo: true,
    reactNative: undefined,
    spinner: sinon.mock(Ora('Hydrogen')),
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
