import { BoilerplateProps, BoilerplateToolbox } from "../../src/types"
import { PackageJSON } from "gluegun/build/types/toolbox/meta-types"
import { BoilerplatePlugin } from "../../src/plugins/IBoilerplatePlugin"

export { createBoilerplateToolbox } from './toolbox'
export const getTemplateProps = (toolbox: BoilerplateToolbox, packageJson: PackageJSON): BoilerplateProps => {
  return {
    name: toolbox.name,
    igniteVersion: '',
    reactNativeVersion: '',
    reactNativeGestureHandlerVersion: '',
    vectorIcons: false,
    animatable: false,
    i18n: false,
    includeDetox: !!packageJson.dependencies.detox,
    useExpo: !!packageJson.dependencies.expo,
    useStateMachineMST: true,
    useNativeBase: true
  }
}

export class Plugins implements BoilerplatePlugin {
  OPTIONS: never
  toolbox: BoilerplateToolbox
  selected: never
  plugins: any

  constructor (toolbox: BoilerplateToolbox) {
    this.plugins = {}
  }

  _iteratePlugins = async (iteratee: Function) => {
    const list = Object.values(this.plugins) as Array<BoilerplateToolbox>
    for (const plugin of list) {
      await iteratee(plugin)
    }
  }

  cleanUp = async () => {
    return this._iteratePlugins(async (plugin) => await plugin.cleanUp())
  }

  select = async (useProjectInfo = false) => {
    return this._iteratePlugins(async (plugin) => await plugin.select(useProjectInfo))
  }

  postPackageInstall = async () => {
    return this._iteratePlugins(async (plugin) => await plugin.postPackageInstall())
  }

  getTemplates = () => {
    const list = Object.values(this.plugins) as Array<BoilerplateToolbox>
    let result = []
    list.forEach(plugin => {
      result = result.concat(plugin.getTemplates())
    })
    return result
  }

  isNativeBaseSelected = () => {
    return true
  }

  isMSTSelected = () => {
    return false
  }

  isDetoxSelected = () => {
    return true
  }
}
