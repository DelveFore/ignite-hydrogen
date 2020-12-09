import { connectState } from "@app/state"
import { connectStyle } from "native-base"
export default (name: string, Component: any) => {
  return connectStyle(name + "Screen", {})(connectState(Component))
}

/*
import { connectState } from '@app/state'
import { withTheme } from "../theming"
export default (name: string, Component: any) => {
  return connectState(withTheme(Component))
}
 */
