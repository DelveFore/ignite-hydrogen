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
  strings,
} from 'gluegun'
import { BoilerplateToolbox } from "../../src/types"
import { Toolbox } from "gluegun/build/domain/toolbox"
import * as sinon from 'sinon'
import Ora = require('ora')

export const createBoilerplateToolbox = (options = {}): BoilerplateToolbox => {
  const toolbox = new Toolbox()
  return {
    ...toolbox,
    build,
    name: 'HydrogenExample',
    useExpo: true,
    ignite: undefined,
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
    strings,
    ...options
  }
}
