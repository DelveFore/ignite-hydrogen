import { GluegunToolbox } from "gluegun"
import ProjectInfo from "../../lib/ProjectInfo"

export interface ScreenTemplateProps {
  pascalName: string
  camelName: string
  name: string
  useStateMachineMST: boolean
}

export const description = "Generates a React Native screen."
export const run = async function(toolbox: GluegunToolbox) {
  // grab some features
  const { parameters, print, strings, ignite, filesystem, patching } = toolbox
  const { camelCase, isBlank, pascalCase } = strings

  // validation
  if (isBlank(parameters.first)) {
    print.info("A name is required.")
    print.info(`ignite generate screen <name>\n`)
    return
  }

  let name = parameters.first
  const matches = name.match(/(.*)((-s|S)creen)$/)
  if (matches) {
    name = matches[1] // grab the name without the suffix
    // prettier-ignore
    print.info(`Note: For future reference, the \`${matches[2]}\` suffix is automatically added for you.`)
    print.info(`You're welcome to add it manually, but we wanted you to know you don't have to. :)`)
  }

  // get permutations of the given name, suffixed
  const pascalName = pascalCase(name)
  const camelName = camelCase(name)

  const props: ScreenTemplateProps = {
    pascalName,
    camelName,
    name,
    useStateMachineMST: ProjectInfo.hasMST(),
  }
  const jobs = [
    {
      template: `screen.ejs`,
      target: `app/screens/${pascalName}/index.tsx`,
    },
  ]

  // make the templates
  await ignite.copyBatch(toolbox, jobs, props)

  // patch the barrel export file
  const barrelExportPath = `${process.cwd()}/app/screens/index.ts`
  const importToAdd = `import ${pascalName} from './${pascalName}'
`

  const exportAfter = `export { `
  const exportWith = `${pascalName}, `

  if (!filesystem.exists(barrelExportPath)) {
    const msg =
      `No '${barrelExportPath}' file found. Can't export screen.` +
      `Export your new screen manually.`
    print.warning(msg)
    process.exit(1)
  }
  await patching.prepend(barrelExportPath, importToAdd)
  await patching.patch(barrelExportPath, { after: exportAfter, insert: exportWith })

  // patch the generated screen to navigation
  const navigationExportPath = `${process.cwd()}/app/navigation/primary-navigator.tsx`
  const importReplaceOf = ` } from '../screens'`
  const importReplaceWith = `, ${pascalName} } from '../screens'`

  const primaryParamListPatchAfter = `export type PrimaryParamList = {`
  const primaryParamListPatchWith = `
  ${camelName}: undefined`

  const stackNavigatorPatchBefore = `</Stack.Navigator>`
  const stackNavigatorPatchWith = `  <Stack.Screen name="${camelName}" component={${pascalName}} />
    `

  if (!filesystem.exists(navigationExportPath)) {
    const msg =
      `No '${navigationExportPath}' file found. Can't export screen.` +
      `Export your new screen manually.`
    print.warning(msg)
    process.exit(1)
  }
  await patching.replace(navigationExportPath, importReplaceOf, importReplaceWith)
  await patching.patch(navigationExportPath, {
    insert: primaryParamListPatchWith,
    after: primaryParamListPatchAfter,
  })
  await patching.patch(navigationExportPath, {
    insert: stackNavigatorPatchWith,
    before: stackNavigatorPatchBefore,
  })

  print.info(`Screen ${pascalName} created`)
}
