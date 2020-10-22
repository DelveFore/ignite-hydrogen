import { IgniteToolbox } from "../types"
import { BoilerplatePlugin } from "./IBoilerplatePlugin"
import StateMachinePlugin, { OPTIONS as StateMachineOptions } from './stateMachine'
import UIPlugin, { OPTIONS as UIOptions } from './ui'

export default class Plugins implements BoilerplatePlugin {
  OPTIONS: never
  toolbox: IgniteToolbox
  selected: never
  plugins: Array<BoilerplatePlugin>

  constructor (toolbox: IgniteToolbox) {
    this.plugins = [
      new StateMachinePlugin(toolbox),
      new UIPlugin(toolbox)
    ]
  }

  cleanUp = async () => {
    for (const plugin of this.plugins) {
      await plugin.cleanUp()
    }
  }

  select = async (useProjectInfo = false) => {
    for (const plugin of this.plugins) {
      await plugin.select(useProjectInfo)
    }
  }

  postPackageInstall = async () => {
    for (const plugin of this.plugins) {
      await plugin.postPackageInstall()
    }
  }

  getTemplates = () => {
    let result = []
    this.plugins.forEach(plugin => {
      result = result.concat(plugin.getTemplates())
    })
    return result
  }

  isNativeBaseSelected = () => {
    return this.plugins[1].selected === UIOptions.NativeBase
  }

  isMSTSelected = () => {
    return this.plugins[0].selected === StateMachineOptions.MST
  }
}
