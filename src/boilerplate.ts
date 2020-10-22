import { getReactNativeVersion } from "./lib/react-native-version"
import { IgniteToolbox, IgniteRNInstallResult, BoilerplateProps } from "./types"
import { expo } from "./lib/expo"
import { codeStyleCleanUp, generateBoilerplate } from "./lib/boilerplate"
import mergePackageJsons from "./lib/mergePackageJsons"
import Plugins from "./plugins"

// We need this value here, as well as in our package.json.ejs template
export const REACT_NATIVE_GESTURE_HANDLER_VERSION = "^1.5.0"

/**
 * Is Android installed?
 *
 * $ANDROID_HOME/tools folder has to exist.
 */
export const isAndroidInstalled = (toolbox: IgniteToolbox): boolean => {
  const androidHome = process.env.ANDROID_HOME
  const hasAndroidEnv = !toolbox.strings.isBlank(androidHome)
  const hasAndroid = hasAndroidEnv && toolbox.filesystem.exists(`${androidHome}/tools`) === "dir"

  return Boolean(hasAndroid)
}

/**
 * Let's install.
 */
export const install = async (toolbox: IgniteToolbox) => {
  const {
    filesystem,
    parameters,
    ignite,
    reactNative,
    print,
    system,
    prompt,
    patching,
    meta,
  } = toolbox
  const { colors } = print
  const { red, yellow, bold, gray, cyan, blue } = colors
  const isWindows = process.platform === "win32"
  const isMac = process.platform === "darwin"
  const reactNativeVersion = getReactNativeVersion(toolbox)

  if (parameters.options["dry-run"]) return

  const perfStart = new Date().getTime()

  // prints info in gray, indenting 2 spaces
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

  const name = parameters.first
  const spinner = print.spin(`using the ${blue("DelveFore")} ${bold("Hydrogen")} boilerplate started from ${red("Infinite Red")} Bowser v5.x.x boilerplate`).succeed()

  // Are we going to use Expo
  let useExpo = parameters.options.expo
  const askAboutExpo = useExpo === undefined
  if (askAboutExpo) {
    useExpo = await prompt.confirm(
      `Would you like to use Expo on this project?\n${gray(`

        Why Expo? Expo (https://expo.io) is the fastest way to get started.
        However, Expo support is experimental at this time. If unsure, select No and we'll install the traditional route.
        Additionally, using Expo means you won't be able to add any custom native modules.

      `)}`,
    )
    if (useExpo) {
      printInfo(`
              We'll initiate your app using Expo. Please note that you won't be able
              to use native modules unless you "eject".

              More info here: https://docs.expo.io/versions/latest/expokit/eject/
          `)
    }
  }

  // Are we going to use Detox
  let includeDetox = false
  if (isMac && !useExpo) {
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
    includeDetox = askAboutDetox
      ? await prompt.confirm("Would you like to include Detox end-to-end tests?")
      : parameters.options.detox === true

    if (includeDetox) {
      // prettier-ignore
      printInfo(`
          You'll love Detox for testing your app! There are some additional requirements to
          install, so make sure to check out ${cyan('e2e/README.md')} in your generated app!
        `)
    }
  } else {
    if (parameters.options.detox === true) {
      if (useExpo) {
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

  // Plugins creation
  const plugins = new Plugins(toolbox)

  // Plugins selections (Ask everything first)
  await plugins.select()

  // attempt to install React Native or die trying
  let rnInstall: IgniteRNInstallResult
  if (useExpo) {
    rnInstall = await expo.install({ name, toolbox })
  } else {
    rnInstall = await reactNative.install({
      name,
      version: reactNativeVersion,
      useNpm: !ignite.useYarn,
    })

    if (rnInstall.exitCode > 0) process.exit(rnInstall.exitCode)
  }

  // remove the __tests__ directory, App.js, and unnecessary config files that come with React Native
  const filesToRemove = [
    ".babelrc",
    "babel.config.js",
    ".buckconfig",
    ".eslintrc.js",
    ".prettierrc.js",
    ".flowconfig",
    "App.js",
    "__tests__",
  ]
  filesToRemove.map(filesystem.remove)

  const templateProps: BoilerplateProps = {
    name,
    igniteVersion: meta.version(),
    reactNativeVersion: rnInstall.version,
    reactNativeGestureHandlerVersion: REACT_NATIVE_GESTURE_HANDLER_VERSION,
    vectorIcons: false,
    animatable: false,
    i18n: false,
    includeDetox,
    useExpo,
    useStateMachineMST: plugins.isMSTSelected(),
    useNativeBase: plugins.isNativeBaseSelected()
  }

  await generateBoilerplate(toolbox, templateProps, spinner, ignite.ignitePluginPath(), plugins)

  await ignite.setIgniteConfig("navigation", "react-navigation")

  /**
   * Because of https://github.com/react-native-community/cli/issues/462,
   * we can't detox-test the release configuration. Turn on dead-code stripping
   * to fix this.
   */
  if (!useExpo && includeDetox) {
    spinner.stop()
    spinner.text = 'Fix Detox Testing (https://github.com/react-native-community/cli/issues/462)'
    await ignite.patchInFile(`ios/${name}.xcodeproj/xcshareddata/xcschemes/${name}.xcscheme`, {
      replace: 'buildForRunning = "YES"\n            buildForProfiling = "NO"',
      insert: 'buildForRunning = "NO"\n            buildForProfiling = "NO"',
    })
    spinner.succeed('Fixed Detox Testing')
  }

  /**
   * Append to files
   */
  // https://github.com/facebook/react-native/issues/12724
  await filesystem.appendAsync(".gitattributes", "*.bat text eol=crlf")

  await mergePackageJsons(toolbox, templateProps, spinner, ignite.ignitePluginPath())

  // pass long the debug flag if we're running in that mode
  const debugFlag = parameters.options.debug ? "--debug" : ""

  try {
    // boilerplate adds itself to get plugin.js/generators etc
    // Could be directory, npm@version, or just npm name.  Default to passed in values
    spinner.stop()

    ignite.log("adding boilerplate to project for generator commands")

    const boilerplate = parameters.options.b || parameters.options.boilerplate || "ignite-hydrogen"
    const isIgniteInstalled = await system.which(`ignite`)
    const igniteCommand = isIgniteInstalled ? "ignite" : "npx ignite-cli"
    await system.exec(`${igniteCommand} add ${boilerplate} ${debugFlag}`)

    if (!useExpo) {
      ignite.log("adding react-native-gesture-handler")
      await ignite.addModule("react-native-gesture-handler", {
        version: REACT_NATIVE_GESTURE_HANDLER_VERSION,
      })

      ignite.log("patching MainActivity.java to add RNGestureHandler")

      ignite.patchInFile(
        `${process.cwd()}/android/app/src/main/java/com/${name.toLowerCase()}/MainActivity.java`,
        {
          after: "import com.facebook.react.ReactActivity;",
          insert: `
        import com.facebook.react.ReactActivityDelegate;
        import com.facebook.react.ReactRootView;
        import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;`,
        },
      )
      ignite.patchInFile(
        `${process.cwd()}/android/app/src/main/java/com/${name.toLowerCase()}/MainActivity.java`,
        {
          after: `public class MainActivity extends ReactActivity {`,
          insert:
            "\n  @Override\n" +
            "  protected ReactActivityDelegate createReactActivityDelegate() {\n" +
            "    return new ReactActivityDelegate(this, getMainComponentName()) {\n" +
            "      @Override\n" +
            "      protected ReactRootView createRootView() {\n" +
            "       return new RNGestureHandlerEnabledRootView(MainActivity.this);\n" +
            "      }\n" +
            "    };\n" +
            "  }",
        },
      )
    }

    if (!useExpo) {
      ignite.log("patching package.json to add solidarity postInstall")
      ignite.patchInFile(`${process.cwd()}/package.json`, {
        replace: `"postinstall": "solidarity",`,
        insert: `"postinstall": "node ./bin/postInstall",`,
      })
    } else {
      filesystem.remove(`${process.cwd()}/bin/postInstall`)
    }
  } catch (e) {
    ignite.log(e)
    print.error(`
      There were errors while generating the project. Run with --debug to see verbose output.
    `)
    throw e
  }

  // re-run yarn; will also install pods, because of our postInstall script.
  const installDeps = ignite.useYarn ? "yarn" : "npm install"
  await system.run(installDeps)

  // install dependencies for Expo
  if (useExpo) {
    ignite.log("adding Expo-compatible dependencies")
    await system.run(`npx expo-cli install \
        expo-localization \
        react-native-gesture-handler \
        react-native-screens \
        react-native-keychain \
        react-navigation \
        react-navigation-stack\
        @react-native-community/masked-view \
        react-native-safe-area-context \
        react-native-safe-area-view \
      `)
  }
  spinner.succeed(`Installed dependencies`)

  spinner.text = 'Plugins: Running Post Package-Install'
  spinner.start()
  await plugins.postPackageInstall()
  spinner.succeed('Plugins: completed Post Package-Install')

  // run react-native link to link assets
  if (!useExpo) {
    spinner.text = "linking assets"
    spinner.start()
    await system.exec("npx react-native link")
    spinner.succeed(`Linked assets`)
  }

  // for Windows, fix the settings.gradle file. Ref: https://github.com/oblador/react-native-vector-icons/issues/938#issuecomment-463296401
  // for ease of use, just replace any backslashes with forward slashes
  if (!useExpo && isWindows) {
    ignite.log("patching Android settings.gradle file for running on Windows")
    await patching.update(`${process.cwd()}/android/settings.gradle`, contents => {
      return contents.split("\\").join("/")
    })
  }
  spinner.text = 'Plugins: Cleaning up'
  spinner.start()
  await plugins.cleanUp()
  spinner.succeed('Plugins: cleaned')

  // let eslint and prettier clean things up
  await codeStyleCleanUp(toolbox, spinner)

  const perfDuration = (new Date().getTime() - perfStart) / 10 / 100
  spinner.succeed(`ignited ${yellow(name)} in ${perfDuration}s`)

  const androidInfo = isAndroidInstalled(toolbox)
    ? ""
    : `\n\nTo run in Android, make sure you've followed the latest react-native setup instructions at https://facebook.github.io/react-native/docs/getting-started.html before using ignite.\nYou won't be able to run ${bold(
        "react-native run-android",
      )} successfully until you have.`

  const runInfo = useExpo
    ? "yarn start"
    : `react-native run-ios\nreact-native run-android${androidInfo}`

  const successMessage = `
    ${red("Ignite CLI")} ignited ${yellow(name)} in ${gray(`${perfDuration}s`)}

    To get started:

      cd ${name}
      ${runInfo}
      npx ignite-cli --help
      npx ignite-cli doctor

    ${bold('🔥 Boom!')}

    ${gray(
      "(Running yarn install one last time to make sure everything is installed -- please be patient!)",
    )}
  `

  print.info(successMessage)
}
