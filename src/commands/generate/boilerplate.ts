import { generateBoilerplate } from '../../lib/boilerplate'
import { IgniteToolbox, BoilerplateProps } from '../../types'
import { read } from 'fs-jetpack'
import * as StateMachine from "../../lib/stateMachine"
import ProjectInfo, { getDepVersion } from "../../lib/ProjectInfo"

export const description = "Generates directly from the Boilerplate overwrites existing files."
export const run = async (toolbox: IgniteToolbox) => {
  const { strings, meta, print, ignite, system } = toolbox
  const { pascalCase } = strings
  const packageJson = JSON.parse(read(process.cwd() + '/package.json'))
  const { name } = packageJson
  const pascalName = pascalCase(name)
  const reactNativeVersion = getDepVersion(packageJson, 'react-native')
  const reactNativeGestureHandlerVersion = getDepVersion(packageJson, 'react-native-gesture-handler')
  const { colors } = print
  const { red, bold, blue } = colors

  const spinner = print.spin(`using the ${blue("DelveFore")} ${bold("Hydrogen")} boilerplate started from ${red("Infinite Red")} Bowser v5.x.x boilerplate`).succeed()

  const props: BoilerplateProps = {
    name: pascalName,
    igniteVersion: meta.version(),
    reactNativeVersion,
    reactNativeGestureHandlerVersion,
    vectorIcons: false,
    animatable: false,
    i18n: false,
    includeDetox: !!packageJson.dependencies.detox,
    useExpo: !!packageJson.dependencies.expo,
    useStateMachineMST: ProjectInfo.hasMST(),
    useNativeBase: ProjectInfo.hasNativeBase()
  }
  await generateBoilerplate(toolbox, props, spinner, `${__dirname}/../../../`)
  spinner.stop()
  spinner.text = 'State Machine cleanup'
  spinner.start()
  await StateMachine.cleanUp(toolbox, packageJson.dependencies.mobx ? StateMachine.OPTIONS.MST : StateMachine.OPTIONS.SAGA_SAUCE)
  ignite.log("linting")
  spinner.text = "linting"
  await system.spawn(`${ignite.useYarn ? "yarn" : "npm run"} lint`)
  ignite.log("formatting")
  spinner.text = "formatting"
  await system.spawn(`${ignite.useYarn ? "yarn" : "npm run"} format`)
  spinner.succeed("Linted and formatted")
  spinner.stop()
}
