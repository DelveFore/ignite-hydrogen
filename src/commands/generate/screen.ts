import { GluegunToolbox } from "gluegun"
import ProjectInfo from "../../lib/ProjectInfo"
const R = require("ramda")

export interface ScreenTemplateProps {
  pascalName: string
  camelName: string
  name: string
  useStateMachineMST: boolean
}

enum ScreenNavigations {
  Primary = "primary",
  Drawer = "drawer",
}

interface Names {
  pascalName: string
  camelName: string
}

const screenImportReplaceOf = ` } from '../screens'`

const addScreenToDrawer = async (names: Names, toolbox: GluegunToolbox) => {
  const { print, filesystem, patching } = toolbox
  const { pascalName } = names
  const navigationExportPath = `${process.cwd()}/app/navigation/Drawer.tsx`
  if (!filesystem.exists(navigationExportPath)) {
    const msg =
      `No '${navigationExportPath}' file found. Can't export screen.` +
      `Export your new screen manually.`
    print.warning(msg)
    return false
  }

  const importReplaceWith = `, ${pascalName} } from '../screens'`

  const paramListPatchAfter = `export type ParamList = {`
  const paramListPatchWith = `
  ${pascalName}: undefined`

  const stackNavigatorPatchBefore = `</Drawer.Navigator>`
  const stackNavigatorPatchWith = `  <Drawer.Screen name="${pascalName}" component={${pascalName}} />
    `

  await patching.replace(navigationExportPath, screenImportReplaceOf, importReplaceWith)
  await patching.patch(navigationExportPath, {
    insert: paramListPatchWith,
    after: paramListPatchAfter,
  })
  await patching.patch(navigationExportPath, {
    insert: stackNavigatorPatchWith,
    before: stackNavigatorPatchBefore,
  })
  return true
}

const addScreenToPrimary = async (names: Names, toolbox: GluegunToolbox) => {
  const { print, filesystem, patching } = toolbox
  const { pascalName } = names
  const navigationExportPath = `${process.cwd()}/app/navigation/Primary.tsx`
  if (!filesystem.exists(navigationExportPath)) {
    const msg =
      `No '${navigationExportPath}' file found. Can't export screen.` +
      `Export your new screen manually.`
    print.warning(msg)
    return false
  }

  const importReplaceWith = `, ${pascalName} } from '../screens'`

  const primaryParamListPatchAfter = `export type PrimaryParamList = {`
  const primaryParamListPatchWith = `
  ${pascalName}: undefined`

  const stackNavigatorPatchBefore = `</Stack.Navigator>`
  const stackNavigatorPatchWith = `  <Stack.Screen name="${pascalName}" component={${pascalName}} />
    `

  await patching.replace(navigationExportPath, screenImportReplaceOf, importReplaceWith)
  await patching.patch(navigationExportPath, {
    insert: primaryParamListPatchWith,
    after: primaryParamListPatchAfter,
  })
  await patching.patch(navigationExportPath, {
    insert: stackNavigatorPatchWith,
    before: stackNavigatorPatchBefore,
  })
  return true
}

export const description = "Generates a React Native screen."
export const run = async function(toolbox: GluegunToolbox) {
  // grab some features
  const { parameters, print, strings, ignite, filesystem, patching, prompt } = toolbox
  const { camelCase, isBlank, pascalCase } = strings

  // validation
  if (isBlank(parameters.first)) {
    print.info("A name is required.")
    print.info(`ignite generate screen <name>\n`)
    return
  }
  const { screenNavigations } = await prompt.ask([
    {
      type: "multiselect",
      name: "screenNavigations",
      message: "Choose Navigations you want to add this Screen to (use space bar to select)?",
      choices: [
        {
          message: "Primary",
          name: ScreenNavigations.Primary,
        },
        {
          message: "Drawer",
          name: ScreenNavigations.Drawer,
        },
      ],
    },
  ])

  // eslint-disable-next-line no-unreachable
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
  const names: Names = {
    pascalName,
    camelName,
  }

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
  if (screenNavigations.length < 1) {
    print.warning(
      `No screen navigations were selected. You need to manually include navigation for your screen.`,
    )
  } else {
    if (R.includes(ScreenNavigations.Primary, screenNavigations)) {
      await addScreenToPrimary(names, toolbox)
    }
    if (R.includes(ScreenNavigations.Drawer, screenNavigations)) {
      await addScreenToDrawer(names, toolbox)
    } else {
      print.info(
        "While the Screen was added to the Primary Navigation it is not immediately available to the User.",
      )
    }
  }

  print.info(`Screen ${pascalName} created`)
}
