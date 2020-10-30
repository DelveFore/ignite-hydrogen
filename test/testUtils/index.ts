import { BoilerplateProps, BoilerplateToolbox } from "../../src/types"
import { BoilerplatePlugin } from "../../src/plugins/IBoilerplatePlugin"
import ProjectInfo from "../../src/lib/ProjectInfo"
import { generateBoilerplate } from "../../src/lib/boilerplate"
import mergePackageJsons from "../../src/lib/mergePackageJsons"

export { createBoilerplateToolbox } from './toolbox'

export class Plugins implements BoilerplatePlugin {
  OPTIONS: never
  toolbox: BoilerplateToolbox
  selected: never
  plugins: any

  constructor (toolbox: BoilerplateToolbox) {
    this.plugins = {}
    this.toolbox = toolbox
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
    return ProjectInfo.hasNativeBase()
  }

  isMSTSelected = () => {
    return ProjectInfo.hasMST()
  }

  isDetoxSelected = () => {
    return true
  }
}

export const generateProject = async (toolbox: BoilerplateToolbox, props: BoilerplateProps, originalDir: string) => {
  await generateBoilerplate(toolbox, props, originalDir, new Plugins(toolbox))
  await mergePackageJsons(toolbox, props, originalDir)
}
