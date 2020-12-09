import { stdin } from "mock-stdin"
import { run } from "../../../src/commands/generate/component"
import { createBoilerplateToolbox, generateProject } from "../../testUtils"
import Console, { ConsoleMethod } from "../../testUtils/Console"
import { BoilerplateProps } from "../../../src/types"
import { delay, sendKeystrokes } from "../../testUtils/cli"
import temp = require("temp")
import mockProcess = require("jest-mock-process")

const originalDir = process.cwd()
// HELPERS
const selectWithoutMobx = async io => {
  await sendKeystrokes(async () => {
    // Move pass Navigation without making a selection
    io.send('n')
    await delay(10)
  })
}
//TODO There is no difference if you select with or without Mobx. Component Generator behave differently if Mobx is selected.
/*
const selectWithMobx = async io => {
  await sendKeystrokes(async () => {
    // Move pass Navigation without making a selection
    io.send('y')
    await delay(10)
  })
}
*/

describe("Generate Component", () => {
  const consoleSpies = new Console(console)
  // Mock stdin so we can send messages to the CLI
  let io = null
  let mockExit = null
  let toolbox = null
  beforeAll(() => {
    io = stdin()
    temp.track()
  })
  afterAll(() => {
    io.restore()
  })
  beforeEach(async () => {
    consoleSpies.mock([ConsoleMethod.log])
    mockExit = mockProcess.mockProcessExit()
    const tempDir = temp.mkdirSync("temp")
    process.chdir(tempDir)
  })
  afterEach(() => {
    consoleSpies.restore()
    temp.cleanupSync()
    process.chdir(originalDir)
    mockExit.mockRestore()
  })
  describe("run() with redux selected in boilerplate", () => {
    beforeEach(async () => {
      toolbox = createBoilerplateToolbox({ cwd: originalDir })
      const templateProps: BoilerplateProps = {
        name: toolbox.name,
        igniteVersion: "",
        reactNativeVersion: "",
        reactNativeGestureHandlerVersion: "",
        vectorIcons: false,
        animatable: false,
        i18n: false,
        includeDetox: false,
        useExpo: false,
        useStateMachineMST: false,
        useNativeBase: true,
      }
      await generateProject(toolbox, templateProps, originalDir)
    })
    it("notifies user that name is required and stops", async () => {
      await run(toolbox)
      expect(console.log).toHaveBeenCalledTimes(2)
      expect(console.log).toHaveProperty("mock.calls")
      expect(consoleSpies.log.mock.calls[0][0]).toContain("A name is required.")
    })
    it("writes CamelCased Component", async () => {
      toolbox.parameters.first = "Example"
      // No need to for Navigation at this time
      await selectWithoutMobx(io)
      await run(toolbox)
      // assertions
      const { filesystem } = toolbox
      expect(consoleSpies.log.mock.calls[0][0]).not.toContain("A name is required.")
      let dirs = filesystem.subdirectories(".")
      expect(dirs).toContain("app")
      dirs = filesystem.subdirectories("./app")
      expect(dirs).toContain("app/screens")
      expect(filesystem.list("app/components")).toContain("Example")
    })
    it("writes content into index.tsx that uses connectStyle()", async () => {
      toolbox.parameters.first = "Example"
      // No need to for Navigation at this time
      await selectWithoutMobx(io)
      await run(toolbox)
      // assertions
      const { filesystem } = toolbox
      expect(filesystem.exists("./app/components/Example/index.tsx")).toBeTruthy()
      const content = filesystem.read("app/components/Example/index.tsx")
      expect(content).toContain("export default connectStyle ('custom.Example', {})(Component)")
    })
    it("index.tsx does not import View from React-Native (we are using using NativeBase)", async () => {
      toolbox.parameters.first = "Example"
      // No need to for Navigation at this time
      await selectWithoutMobx(io)
      await run(toolbox)
      // assertions
      const { filesystem } = toolbox
      const content = filesystem.read("app/components/Example/index.tsx")
      expect(content).not.toContain("import { View } from 'react-native'")
      expect(content).toContain("import { View, connectStyle } from 'native-base'")
    })
    it("component is included in 'component/index.ts'", async () => {
      toolbox.parameters.first = "Example"
      // No need to for Navigation at this time
      await selectWithoutMobx(io)
      await run(toolbox)
      // assertions
      const { filesystem } = toolbox
      const content = filesystem.read("app/components/index.ts")
      expect(content).toContain("export * from \"./example/example\"")
    })
    it("component story is included in 'storybook-registry.ts'", async () => {
      toolbox.parameters.first = "Example"
      // No need to for Navigation at this time
      await selectWithoutMobx(io)
      await run(toolbox)
      // assertions
      const { filesystem } = toolbox
      const content = filesystem.read("storybook/storybook-registry.ts")
      expect(content).toContain("require(\"../app/components/example/example.story\")")
    })
  })
})
