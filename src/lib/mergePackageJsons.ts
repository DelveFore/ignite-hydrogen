import { IgniteToolbox, BoilerplateProps } from "../types"
import { __, assoc, merge, omit, pipe } from "ramda"

export const _mergePackages = (currentPackage, templatePackage) => {
  return pipe(
    assoc("dependencies", merge(currentPackage.dependencies, templatePackage.dependencies)),
    assoc(
      "devDependencies",
      merge(
        omit(["@react-native-community/eslint-config"], currentPackage.devDependencies),
        templatePackage.devDependencies,
      ),
    ),
    assoc("scripts", merge(currentPackage.scripts, templatePackage.scripts)),
    merge(__, omit(["dependencies", "devDependencies", "scripts"], templatePackage)),
  )(currentPackage)
}

/**
 * Merge the package.json from our template into the one provided from react-native init.
 */
export default async (toolbox: IgniteToolbox, templateProps: BoilerplateProps, spinner, pluginPath: string) => {
  const { ignite, template, strings, filesystem } = toolbox
  // transform our package.json so we can replace variables
  ignite.log("merging Hydrogen package.json with React Native package.json")
  const rawJson = await template.generate({
    directory: `${pluginPath}/boilerplate`,
    template: "package.json.ejs",
    props: { ...templateProps, kebabName: strings.kebabCase(templateProps.name) },
  })
  const newPackageJson = JSON.parse(rawJson)

  // read in the react-native created package.json
  const currentPackage = filesystem.read("package.json", "json")

  // deep merge
  const newPackage = _mergePackages(currentPackage, newPackageJson)

  // write this out
  ignite.log("writing newly merged package.json")
  filesystem.write("package.json", newPackage, { jsonIndent: 2 })
  spinner.succeed('Merged package.json from template with existing package.json')
}
