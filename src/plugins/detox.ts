import { BoilerplateToolbox } from "../types"
import { BoilerplatePlugin } from "./IBoilerplatePlugin"
import { getReactNativeVersion } from "../lib/react-native-version"

export const enum OPTIONS {
  NO,
  YES,
}

export default class Plugin implements BoilerplatePlugin {
  OPTIONS

  toolbox: BoilerplateToolbox

  selected: OPTIONS

  useExpo: boolean

  constructor(toolbox: BoilerplateToolbox) {
    this.toolbox = toolbox
    this.useExpo = toolbox.useExpo
  }

  select = async () => {
    const { print, system, parameters, prompt } = this.toolbox
    const { colors } = print
    const { gray, cyan } = colors
    const isMac = process.platform === "darwin"
    const reactNativeVersion = getReactNativeVersion(this.toolbox)
    const printInfo = info =>
      print.info(
        gray(
          "  " +
            info
              .split("\n")
              .map(s => s.trim())
              .join("\n  "),
        ),
      )
    let selected = false
    if (isMac && !this.useExpo) {
      const isCocoapodsInstalled = await system.which(`pod`)
      if (!isCocoapodsInstalled && reactNativeVersion >= "0.60") {
        print.error(`
Error: Cocoapods is not installed, but is required for React Native
0.60 or later, when not using Expo.

More info here: https://reactnative.dev/docs/environment-setup
And here: https://guides.cocoapods.org/using/getting-started.html
      `)
        process.exit(1)
      }

      const askAboutDetox = parameters.options.detox === undefined
      selected = askAboutDetox
        ? await prompt.confirm("Would you like to include Detox end-to-end tests?")
        : parameters.options.detox === true

      if (selected) {
        // prettier-ignore
        printInfo(`
          You'll love Detox for testing your app! There are some additional requirements to
          install, so make sure to check out ${cyan('e2e/README.md')} in your generated app!
        `)
      }
    } else {
      if (parameters.options.detox === true) {
        if (this.useExpo) {
          printInfo(`
            We don't yet support adding Detox to an Expo app automatically.
            Want to help? Please submit a PR!
  
            Also, check out this article for how to add Detox manually:
            https://blog.expo.io/testing-expo-apps-with-detox-and-react-native-testing-library-7fbdbb82ac87
        `)
        } else {
          printInfo("Skipping Detox because it is only supported on macOS")
        }
      }
    }
    return { selected }
  }

  cleanUp = async () => null

  postPackageInstall = async () => {
    const { spinner, name, useExpo, ignite } = this.toolbox
    /**
     * Because of https://github.com/react-native-community/cli/issues/462,
     * we can't detox-test the release configuration. Turn on dead-code stripping
     * to fix this.
     */
    if (!useExpo && this.selected) {
      spinner.stop()
      spinner.text = "Fix Detox Testing (https://github.com/react-native-community/cli/issues/462)"
      await ignite.patchInFile(`ios/${name}.xcodeproj/xcshareddata/xcschemes/${name}.xcscheme`, {
        replace: 'buildForRunning = "YES"\n            buildForProfiling = "NO"',
        insert: 'buildForRunning = "NO"\n            buildForProfiling = "NO"',
      })
      spinner.succeed("Fixed Detox Testing")
    }
  }

  getTemplates = () => {
    return []
  }
}
