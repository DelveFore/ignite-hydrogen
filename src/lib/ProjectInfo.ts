import { read } from "fs-jetpack"
import { PackageJSON } from "gluegun/build/types/toolbox/meta-types"
import { isEmpty, isNil } from "lodash"

export const getDepVersion = (info: PackageJSON, dependencyKey: string) => {
  return info.dependencies[dependencyKey]
}

/**
 * Designed specifically for an already built project
 */
export default {
  getDepVersion,
  hasMST() {
    const info = JSON.parse(read(process.cwd() + "/package.json"))
    const version = getDepVersion(info, "mobx")
    return !isNil(version) && !isEmpty(version)
  },
  hasNativeBase() {
    const info = JSON.parse(read(process.cwd() + "/package.json"))
    const version = getDepVersion(info, "native-base")
    return !isNil(version) && !isEmpty(version)
  },
  hasReactNativePaper() {
    const info = JSON.parse(read(process.cwd() + "/package.json"))
    const version = getDepVersion(info, "react-native-paper")
    return !isNil(version) && !isEmpty(version)
  }
}
