import { IgniteToolbox } from "../types"
import { BoilerplatePlugin } from "./IBoilerplatePlugin"
import ProjectInfo from "../lib/ProjectInfo"

export const enum OPTIONS {
  NativeBase= 'NativeBase',
  Paper = 'Paper'
}

export default class Plugin implements BoilerplatePlugin {
  OPTIONS
  toolbox: IgniteToolbox
  willEjectNativeBaseTheme: boolean
  selected: OPTIONS

  constructor (toolbox: IgniteToolbox) {
    this.toolbox = toolbox
  }

  select = async (useProjectInfo = false) => {
    if (useProjectInfo) {
      return await this.selectFromProjectInfo()
    }
    return await this.selectFromUserInteraction()
  }

  cleanUp = async () => {
    const { filesystem } = this.toolbox
    if (this.selected === OPTIONS.NativeBase) {
      if (filesystem.exists(`${process.cwd()}/native-base-theme`)) {
        filesystem.move(`${process.cwd()}/native-base-theme/components`, `${process.cwd()}/app/theme/components`)
        filesystem.move(`${process.cwd()}/native-base-theme/variables`, `${process.cwd()}/app/theme/variables`)
        filesystem.remove(`${process.cwd()}/native-base-theme`)
      }
    }
  }

  postPackageInstall = async () => {
    if (this.willEjectNativeBaseTheme) {
      await this._ejectNativeBaseTheme()
    }
  }

  getTemplates = () => {
    return []
  }

  selectFromUserInteraction = async () => {
    const { prompt } = this.toolbox
    const { selected } = await prompt.ask([
      {
        type: 'select',
        name: 'selected',
        message: 'What UI Component Library do you want to use',
        choices: [
          {
            message: 'NativeBase (https://nativebase.io/)',
            name: OPTIONS.NativeBase
          },
          {
            message: '[COMING SOON] React Native Paper (https://callstack.github.io/react-native-paper/)',
            name: OPTIONS.Paper,
            disabled: true
          }
        ],
      }
    ])
    this.selected = selected
    this.willEjectNativeBaseTheme = selected === OPTIONS.NativeBase ? await prompt.confirm('Would you like to eject NativeBase Theme?') : false
    return {
      selected,
      willEjectNativeBaseTheme: this.willEjectNativeBaseTheme
    }
  }

  selectFromProjectInfo = async () => {
    this.selected = ProjectInfo.hasNativeBase() ? OPTIONS.NativeBase : OPTIONS.Paper
    this.willEjectNativeBaseTheme = false
    return {
      selected: this.selected,
      willEjectNativeBaseTheme: this.willEjectNativeBaseTheme
    }
  }

  _ejectNativeBaseTheme = async () => {
    const { system } = this.toolbox
    await system.run('node node_modules/native-base/ejectTheme.js')
  }
}
