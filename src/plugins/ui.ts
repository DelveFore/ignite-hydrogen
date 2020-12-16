import { BoilerplateToolbox } from "../types"
import { BoilerplatePlugin } from "./IBoilerplatePlugin"
import ProjectInfo from "../lib/ProjectInfo"

export const enum OPTIONS {
  NativeBase = "NativeBase",
  Paper = "Paper",
}

export default class Plugin implements BoilerplatePlugin {
  OPTIONS
  toolbox: BoilerplateToolbox
  willEjectNativeBaseTheme: boolean
  selected: OPTIONS

  constructor(toolbox: BoilerplateToolbox) {
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
    const projectBase = process.cwd()
    if (this.selected === OPTIONS.NativeBase) {
      if (filesystem.exists(`${projectBase}/native-base-theme`)) {
        filesystem.move(
          `${projectBase}/native-base-theme/components`,
          `${projectBase}/app/theme/components`,
        )
        filesystem.move(
          `${projectBase}/native-base-theme/variables`,
          `${projectBase}/app/theme/variables`,
        )
        filesystem.remove(`${projectBase}/native-base-theme`)
        filesystem.remove(`${projectBase}/app/theming/paper`)
      }
      filesystem.move(
        `${projectBase}/app/screens/createScreen/nativeBase.ts`,
        `${projectBase}/app/screens/createScreen.ts`
      )
    } else {
      filesystem.move(
        `${projectBase}/app/screens/createScreen/paper.ts`,
        `${projectBase}/app/screens/createScreen.ts`
      )
      filesystem.remove(`${process.cwd()}/app/theming/nativeBase`)
    }
    filesystem.remove(`${projectBase}/app/screens/createScreen`)
  }

  postPackageInstall = async () => {
    if (this.willEjectNativeBaseTheme) {
      await this._ejectNativeBaseTheme()
    }
  }

  getTemplates = () => {
    return [{ template: "app/theming/index.ts.ejs", target: "app/theming/index.ts" }]
  }

  selectFromUserInteraction = async () => {
    const { prompt } = this.toolbox
    const { selected } = await prompt.ask([
      {
        type: "select",
        name: "selected",
        message: "What UI Component Library do you want to use",
        choices: [
          {
            message: "NativeBase (https://nativebase.io/)",
            name: OPTIONS.NativeBase,
          },
          {
            message:
              "React Native Paper (https://callstack.github.io/react-native-paper/)",
            name: OPTIONS.Paper,
          },
        ],
      },
    ])
    this.selected = selected
    this.willEjectNativeBaseTheme =
      selected === OPTIONS.NativeBase
        ? await prompt.confirm("Would you like to eject NativeBase Theme?")
        : false
    return {
      selected,
      willEjectNativeBaseTheme: this.willEjectNativeBaseTheme,
    }
  }

  selectFromProjectInfo = async () => {
    this.selected = ProjectInfo.hasNativeBase() && !ProjectInfo.hasReactNativePaper()
      ? OPTIONS.NativeBase
      : OPTIONS.Paper
    this.willEjectNativeBaseTheme = false
    return {
      selected: this.selected,
      willEjectNativeBaseTheme: this.willEjectNativeBaseTheme,
    }
  }

  _ejectNativeBaseTheme = async () => {
    const { system } = this.toolbox
    await system.run("node node_modules/native-base/ejectTheme.js")
  }
}
