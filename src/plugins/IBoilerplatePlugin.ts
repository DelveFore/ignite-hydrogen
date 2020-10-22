import { IgniteToolbox, IgniteCopyJob } from "../types"

export interface GetTemplates {
  (): ReadonlyArray<IgniteCopyJob>
}

export interface BoilerplatePlugin {
  selected: any
  OPTIONS: Enumerator
  toolbox: IgniteToolbox
  postPackageInstall: any
  cleanUp: any
  select: any
  getTemplates: GetTemplates
}
