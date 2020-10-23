import { BoilerplateToolbox, IgniteCopyJob } from "../types"

export interface GetTemplates {
  (): ReadonlyArray<IgniteCopyJob>
}

export interface BoilerplatePlugin {
  selected: any
  OPTIONS: Enumerator
  toolbox: BoilerplateToolbox
  postPackageInstall: any
  cleanUp: any
  select: any
  getTemplates: GetTemplates
}
