import { connectState } from "@app/state"
// TODO Support NativeBase alternative
import { connectStyle } from "native-base"
export default (name: string, Component: any) => {
  return connectStyle(name + "Screen", {})(connectState(Component))
}
