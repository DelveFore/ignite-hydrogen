import { IgniteToolbox } from "../types"

export const enum OPTIONS {
  NativeBase= 'NativeBase',
  Paper = 'Paper'
}

export const select = async (toolbox: IgniteToolbox) => {
  const { prompt } = toolbox
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
          message: 'React Native Paper (https://callstack.github.io/react-native-paper/)',
          name: OPTIONS.Paper,
          disabled: true
        }
      ],
    }
  ])
  // TODO Only ask NativeBase Theme Ejection when NativeBase is selected
  const willEjectNativeBaseTheme = await prompt.confirm('Would you like to eject NativeBase Theme?')
  return { selected, willEjectNativeBaseTheme }
}

export const TEMPLATES = []

export const ejectNativeBaseTheme = async (toolbox: IgniteToolbox) => {
  const { system } = toolbox
  await system.run('node node_modules/native-base/ejectTheme.js')
}

export const cleanUp = async (toolbox: IgniteToolbox, selected) => {
  const { filesystem } = toolbox
  if (OPTIONS.NativeBase === selected) {
    filesystem.move(`${process.cwd()}/native-base-theme/components`, `${process.cwd()}/app/theme/components`)
    filesystem.move(`${process.cwd()}/native-base-theme/variables`, `${process.cwd()}/app/theme/variables`)
    filesystem.remove(`${process.cwd()}/native-base-theme`)
  }
}
