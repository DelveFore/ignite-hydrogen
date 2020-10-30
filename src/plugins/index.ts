import { BoilerplateToolbox } from "../types"
import { BoilerplatePlugin } from "./IBoilerplatePlugin"
import StateMachinePlugin, { OPTIONS as StateMachineOptions } from "./stateMachine"
import UIPlugin, { OPTIONS as UIOptions } from "./ui"
import DetoxPlugin from "./detox"

export default class Plugins implements BoilerplatePlugin {
  OPTIONS: never
  toolbox: BoilerplateToolbox
  selected: never
  plugins: any

  constructor(toolbox: BoilerplateToolbox) {
    this.plugins = {
      DetoxPlugin: new DetoxPlugin(toolbox),
      StateMachinePlugin: new StateMachinePlugin(toolbox),
      UIPlugin: new UIPlugin(toolbox),
    }
  }

  _iteratePlugins = async (iteratee: Function) => {
    const list = Object.values(this.plugins) as Array<BoilerplateToolbox>
    for (const plugin of list) {
      await iteratee(plugin)
    }
  }

  cleanUp = async () => {
    return this._iteratePlugins(async plugin => await plugin.cleanUp())
  }

  select = async (useProjectInfo = false) => {
    return this._iteratePlugins(async plugin => await plugin.select(useProjectInfo))
  }

  postPackageInstall = async () => {
    return this._iteratePlugins(async plugin => await plugin.postPackageInstall())
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
    return this.plugins.UIPlugin.selected === UIOptions.NativeBase
  }

  isMSTSelected = () => {
    return this.plugins.StateMachinePlugin.selected === StateMachineOptions.MST
  }

  isDetoxSelected = () => {
    return this.plugins.DetoxPlugin.selected
  }
}
