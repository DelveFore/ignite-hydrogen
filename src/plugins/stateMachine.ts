import { BoilerplateToolbox } from "../types"
import { BoilerplatePlugin } from "./IBoilerplatePlugin"
import ProjectInfo from "../lib/ProjectInfo"

export const enum OPTIONS {
  MST = "MST",
  SAGA_SAUCE = "SagaSauce",
}

export default class Plugin implements BoilerplatePlugin {
  OPTIONS

  toolbox: BoilerplateToolbox

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
    if (this.selected === OPTIONS.SAGA_SAUCE) {
      filesystem.copy(`${process.cwd()}/app/state/redux`, `${process.cwd()}/app/state/`, {
        overwrite: true,
      })
      filesystem.remove(`${process.cwd()}/app/state/models`)
    }

    filesystem.remove(`${process.cwd()}/app/state/redux`)
  }

  postPackageInstall = async () => null

  getTemplates = () => {
    return [{ template: "app/state/index.ts.ejs", target: "app/state/index.ts" }]
  }

  selectFromUserInteraction = async () => {
    const { prompt } = this.toolbox
    const { selected } = await prompt.ask([
      {
        type: "select",
        name: "selected",
        message: "What State Machine do you want to use",
        choices: [
          {
            message: "Redux + SagaSauce",
            name: OPTIONS.SAGA_SAUCE,
          },
          {
            message: "Mobx State Tree",
            name: OPTIONS.MST,
          },
        ],
      },
    ])
    this.selected = selected
    return { selected }
  }

  selectFromProjectInfo = async () => {
    this.selected = ProjectInfo.hasMST() ? OPTIONS.MST : OPTIONS.SAGA_SAUCE
    return { selected: this.selected }
  }
}
