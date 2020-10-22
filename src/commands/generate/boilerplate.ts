import { codeStyleCleanUp, generateBoilerplate } from "../../lib/boilerplate"
import { IgniteToolbox, BoilerplateProps } from '../../types'
import { read } from 'fs-jetpack'
import Plugins from "../../plugins"
import ProjectInfo, { getDepVersion } from "../../lib/ProjectInfo"

export const description = "Generates directly from the Boilerplate overwrites existing files."
export const run = async (toolbox: IgniteToolbox) => {
  const { strings, meta, print } = toolbox
  const { pascalCase } = strings
  const packageJson = JSON.parse(read(process.cwd() + '/package.json'))
  const { name } = packageJson
  const pascalName = pascalCase(name)
  const reactNativeVersion = getDepVersion(packageJson, 'react-native')
  const reactNativeGestureHandlerVersion = getDepVersion(packageJson, 'react-native-gesture-handler')
  const { colors } = print
  const { red, bold, blue } = colors

  const spinner = print.spin(`using the ${blue("DelveFore")} ${bold("Hydrogen")} boilerplate started from ${red("Infinite Red")} Bowser v5.x.x boilerplate`).succeed()

  const plugins = new Plugins(toolbox)
  await plugins.select(true)

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
  await generateBoilerplate(toolbox, props, spinner, `${__dirname}/../../../`, plugins)
  spinner.stop()
  spinner.text = 'Plugins cleanup'
  spinner.start()
  await plugins.cleanUp()
  await codeStyleCleanUp(toolbox, spinner)
}
