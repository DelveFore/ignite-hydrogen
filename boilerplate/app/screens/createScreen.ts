import { connectState } from "@app/state"
// TODO Support NativeBase alternative
import { connectStyle } from "native-base"
export default (name: string, Component: any) => {
  return connectStyle(name + "Screen", {})(connectState(Component))
}

/*
import { connectState } from '@app/state'
import { withTheme } from "../theming"
// TODO Support NativeBase alternative
export default (name: string, Component: any) => {
  return connectState(withTheme(Component))
}
 */
