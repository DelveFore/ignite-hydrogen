import { IgniteToolbox } from "../types"
export const enum OPTIONS {
  MST = 'MST',
  SAGA_SAUCE = 'SagaSauce'
}

export const select = async (toolbox: IgniteToolbox) => {
  const { prompt } = toolbox
  const { selected } = await prompt.ask([
    {
      type: 'select',
      name: 'selected',
      message: 'What State Machine do you want to use',
      choices: [
        {
          message: 'Redux + SagaSauce',
          name: OPTIONS.SAGA_SAUCE
        },
        {
          message: 'Mobx State Tree',
          name: OPTIONS.MST
        }
      ],
    }
  ])
  return { selected }
}

export const TEMPLATES = [
  { template: "app/state/connect.ts.ejs", target: "app/state/connect.ts" },
  { template: "app/state/index.ts.ejs", target: "app/state/index.ts" }
]

export const cleanUp = async (toolbox: IgniteToolbox, selected) => {
  const { filesystem } = toolbox
  if (selected === OPTIONS.SAGA_SAUCE) {
    filesystem.copy(`${process.cwd()}/app/state/redux`, `${process.cwd()}/app/state/`, { overwrite: true })
    filesystem.remove(`${process.cwd()}/app/state/redux`)
    filesystem.remove(`${process.cwd()}/app/state/models`)
  }
}
