import { BoilerplateProps, BoilerplateToolbox } from "../types"
import { BoilerplatePlugin } from "../plugins/IBoilerplatePlugin"

export const codeStyleCleanUp = async (toolbox: BoilerplateToolbox) => {
  const { system, ignite, spinner } = toolbox
  ignite.log("linting")
  spinner.text = "linting"
  await system.spawn(`${ignite.useYarn ? "yarn" : "npm run"} lint`)
  ignite.log("formatting")
  spinner.text = "formatting"
  await system.spawn(`${ignite.useYarn ? "yarn" : "npm run"} format`)
  spinner.succeed("Linted and formatted")
}

export const generateBoilerplate = async (
  toolbox: BoilerplateToolbox,
  templateProps: BoilerplateProps,
  pluginPath: string,
  boilerPlatePlugins: BoilerplatePlugin,
) => {
  const { filesystem, ignite, spinner } = toolbox
  const { includeDetox, useExpo } = templateProps

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
      template: "app/screens/Welcome/index.tsx.ejs",
      target: "app/screens/Welcome/index.tsx",
    },
    {
      template: "app/screens/Dashboard/index.tsx.ejs",
      target: "app/screens/Dashboard/index.tsx",
    },
    {
      template: "app/screens/Dashboard/UserListItem.tsx.ejs",
      target: "app/screens/Dashboard/UserListItem.tsx",
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
      target: "app/utils/storage/storage.ts",
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
      template: "app/navigation/Primary.tsx.ejs",
      target: "app/navigation/Primary.tsx",
    },
    { template: "storybook/storybook.tsx.ejs", target: "storybook/storybook.tsx" },
    { template: "bin/postInstall", target: "bin/postInstall" },
  ]
    .concat(boilerPlatePlugins.getTemplates())
    .concat(EXAMPLE_SCREENS)

  await ignite.copyBatch(toolbox, templates, templateProps, {
    quiet: true,
    askToOverwrite: true, // TODO Ask IgniteRed why this askToOverwrite isn't an option for `copyBatch`. It appears you are required to do it in the project configuration.
    directory: boilerplatePath,
  })

  spinner.succeed("Copied boilerplate files")
}
