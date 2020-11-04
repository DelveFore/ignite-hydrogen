import { stdin } from "mock-stdin"
import * as stdMocks from "std-mocks"
import UIPlugin, { OPTIONS } from "../../../src/plugins/ui"
import { KEYS, sendKeystrokes, delay } from "../../testUtils/cli"
import { createBoilerplateToolbox } from "../../testUtils"

describe("Boilerplate Plugin UI", () => {
  // Mock stdin so we can send messages to the CLI
  let io = null
  beforeAll(() => {
    stdMocks.use()
    io = stdin()
  })
  afterAll(() => {
    stdMocks.restore()
    io.restore()
  })
  describe("select()", () => {
    it("prompts and returns selected for NativeBase", async () => {
      const toolbox = createBoilerplateToolbox()
      sendKeystrokes(async () => {
        io.send(KEYS.Enter)
        await delay(10)
        io.send("y")
        await delay(10)
      })
      const plugin = new UIPlugin(toolbox)
      const result = await plugin.select()
      const stdoutResult = stdMocks.flush().stdout
      expect(stdoutResult[1]).toContain("What UI Component Library do you want to use")
      expect(stdoutResult[1]).toContain("NativeBase")
      expect(result).toHaveProperty("selected", OPTIONS.NativeBase)
      expect(plugin.selected).toEqual(OPTIONS.NativeBase)
    })
  })
  describe("postPackageInstall()", () => {
    it("when eject NativeBase theme is selected then native-base eject script is executed", async () => {
      const toolbox = createBoilerplateToolbox()
      toolbox.system = {
        ...toolbox.system,
        run: jest.fn(),
      }
      sendKeystrokes(async () => {
        io.send(KEYS.Enter)
        await delay(10)
        io.send("y")
        await delay(10)
      })
      const plugin = new UIPlugin(toolbox)
      await plugin.select()
      expect(plugin.willEjectNativeBaseTheme).toEqual(true)
      await plugin.postPackageInstall()
      expect(toolbox.system.run).toHaveBeenCalledWith("node node_modules/native-base/ejectTheme.js")
    })
    it("when eject NativeBase theme is NOT selected native-base eject script is not executed", async () => {
      const toolbox = createBoilerplateToolbox()
      toolbox.system = {
        ...toolbox.system,
        run: jest.fn(),
      }
      sendKeystrokes(async () => {
        io.send(KEYS.Enter)
        await delay(10)
        io.send("N")
        await delay(10)
      })
      const plugin = new UIPlugin(toolbox)
      await plugin.select()
      expect(plugin.willEjectNativeBaseTheme).toEqual(false)
      await plugin.postPackageInstall()
      expect(toolbox.system.run).not.toHaveBeenCalledWith(
        "node node_modules/native-base/ejectTheme.js",
      )
    })
  })
})
