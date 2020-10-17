import { IgniteToolbox } from "../types"
import * as StateMachine from "./stateMachine"

export interface BoilerplateProps {
  name: string
  igniteVersion: string
  reactNativeVersion: string
  reactNativeGestureHandlerVersion: string
  vectorIcons: boolean
  animatable: boolean
  i18n: boolean
  includeDetox: boolean
  useExpo: boolean
  useStateMachineMST: boolean
  useNativeBase: boolean
}

export const generateBoilerplate = async (templateProps: BoilerplateProps, spinner, toolbox: IgniteToolbox, pluginPath: string) => {
  const {
    filesystem,
    ignite,
  } = toolbox
  const {
    includeDetox,
    useExpo
  } = templateProps
  // copy our App, Tests & storybook directories
  spinner.text = "▸ copying files"
  spinner.start()
  const boilerplatePath = `${pluginPath}/boilerplate`
  const copyOpts = { overwrite: true, matching: "!*.ejs" }
  filesystem.copy(`${boilerplatePath}/app`, `${process.cwd()}/app`, copyOpts)
  filesystem.copy(`${boilerplatePath}/assets`, `${process.cwd()}/assets`, copyOpts)
  filesystem.copy(`${boilerplatePath}/test`, `${process.cwd()}/test`, copyOpts)
  filesystem.copy(`${boilerplatePath}/storybook`, `${process.cwd()}/storybook`, copyOpts)
  filesystem.copy(`${boilerplatePath}/bin`, `${process.cwd()}/bin`, copyOpts)
  includeDetox && filesystem.copy(`${boilerplatePath}/e2e`, `${process.cwd()}/e2e`, copyOpts)
  if (useExpo) {
    const mocksToRemove = [
      "__snapshots__",
      "mock-async-storage.ts",
      "mock-i18n.ts",
      "mock-react-native-localize.ts",
      "mock-reactotron.ts",
      "setup.ts",
    ]
    mocksToRemove.map(mock => filesystem.remove(`${process.cwd()}/test/${mock}`))
  } else {
    filesystem.remove(`${process.cwd()}/app/theme/fonts/index.ts`)
  }
  spinner.stop()

  // generate the templates
  spinner.text = "▸ generating files"
  spinner.start()
  const EXAMPLE_SCREENS = [
    {
      template: "app/screens/welcome-screen/index.tsx.ejs",
      target: "app/screens/welcome-screen/index.tsx",
    },
    {
      template: "app/screens/demo-screen/index.tsx.ejs",
      target: "app/screens/demo-screen/index.tsx",
    }
  ]
  const templates = [
    { template: "index.js.ejs", target: useExpo ? "App.js" : "index.js" },
    { template: "README.md", target: "README.md" },
    { template: ".gitignore.ejs", target: ".gitignore" },
    { template: ".env.example", target: ".env" },
    { template: ".prettierignore", target: ".prettierignore" },
    { template: ".solidarity", target: ".solidarity" },
    { template: "babel.config.js.ejs", target: "babel.config.js" },
    { template: "react-native.config.js", target: "react-native.config.js" },
    { template: "tsconfig.json", target: "tsconfig.json" },
    { template: "app/app.tsx.ejs", target: "app/app.tsx" },
    { template: "app/i18n/i18n.ts.ejs", target: "app/i18n/i18n.ts" },
    {
      template: "app/services/reactotron/reactotron.ts.ejs",
      target: "app/services/reactotron/reactotron.ts",
    },
    {
      template: "app/utils/storage/storage.ts.ejs",
      target: "app/utils/storage/storage.ts"
    },
    {
      template: "app/utils/storage/storage.test.ts.ejs",
      target: "app/utils/storage/storage.test.ts",
    },
    {
      template: "app/navigation/root-navigator.tsx.ejs",
      target: "app/navigation/root-navigator.tsx",
    },
    {
      template: "app/navigation/primary-navigator.tsx.ejs",
      target: "app/navigation/primary-navigator.tsx",
    },
    { template: "storybook/storybook.tsx.ejs", target: "storybook/storybook.tsx" },
    { template: "bin/postInstall", target: "bin/postInstall" },
  ]
    .concat(StateMachine.TEMPLATES)
    .concat(EXAMPLE_SCREENS)

  await ignite.copyBatch(toolbox, templates, templateProps, {
    quiet: true,
    directory: boilerplatePath,
  })

  spinner.succeed('Copied boilerplate files')
}
