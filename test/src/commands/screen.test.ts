import { stdin } from "mock-stdin"
import { run } from "../../../src/commands/generate/screen"
import { createBoilerplateToolbox, generateProject } from "../../testUtils"
import Console, { ConsoleMethod } from "../../testUtils/Console"
import { BoilerplateProps } from "../../../src/types"
import { delay, KEYS, sendKeystrokes } from "../../testUtils/cli"
import temp = require("temp")
import mockProcess = require("jest-mock-process")

const originalDir = process.cwd()
// HELPERS
const selectNoNavigation = async io => {
  await sendKeystrokes(async () => {
    // Move pass Navigation without making a selection
    io.send(KEYS.Enter)
    await delay(10)
  })
}

const selectOnlyPrimaryNavigation = async io => {
  await sendKeystrokes(async () => {
    io.send(KEYS.Space)
    await delay(10)
    io.send(KEYS.Enter)
    await delay(10)
  })
}

const selectOnlyDrawerNavigation = async io => {
  await sendKeystrokes(async () => {
    io.send(KEYS.Down)
    await delay(10)
    io.send(KEYS.Space)
    await delay(10)
    io.send(KEYS.Enter)
    await delay(10)
  })
}

const selectDrawerAndPrimaryNavigation = async io => {
  await sendKeystrokes(async () => {
    io.send(KEYS.Space)
    await delay(10)
    io.send(KEYS.Down)
    await delay(10)
    io.send(KEYS.Space)
    await delay(10)
    io.send(KEYS.Enter)
    await delay(10)
  })
}

describe("Generate Screen", () => {
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
  describe("run() not impacted by boilerplate selections", () => {
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
    it("writes CamelCased Screen", async () => {
      toolbox.parameters.first = "Example"
      // No need to for Navigation at this time
      await selectNoNavigation(io)
      await run(toolbox)
      // assertions
      const { filesystem } = toolbox
      expect(consoleSpies.log.mock.calls[0][0]).not.toContain("A name is required.")
      let dirs = filesystem.subdirectories(".")
      expect(dirs).toContain("app")
      dirs = filesystem.subdirectories("./app")
      expect(dirs).toContain("app/screens")
      expect(filesystem.list("app/screens")).toContain("Example")
    })
    it("writes content into index.tsx that uses createScreen()", async () => {
      toolbox.parameters.first = "Example"
      // No need to for Navigation at this time
      await selectNoNavigation(io)
      await run(toolbox)
      // assertions
      const { filesystem } = toolbox
      expect(filesystem.exists("./app/screens/Example/index.tsx")).toBeTruthy()
      const content = filesystem.read("app/screens/Example/index.tsx")
      expect(content).toContain("export default createScreen('Example'")
    })
    it("index.tsx does not contain ViewStyle (we are using using NativeBase)", async () => {
      toolbox.parameters.first = "Example"
      // No need to for Navigation at this time
      await selectNoNavigation(io)
      await run(toolbox)
      // assertions
      const { filesystem } = toolbox
      const content = filesystem.read("app/screens/Example/index.tsx")
      expect(content).not.toContain("ViewStyle")
      expect(content).not.toContain("import { ViewStyle } from 'react-native'")
      expect(content).not.toContain("import { color } from '../../theme'")
    })
    describe("user selected Navigation insertions", () => {
      it("does not add to Primary or Drawer", async () => {
        toolbox.parameters.first = "Example"
        await selectNoNavigation(io)
        await run(toolbox)
        // assertions
        const { filesystem } = toolbox
        let content = filesystem.read("app/navigation/Primary.tsx")
        expect(content).not.toContain("Example")
        content = filesystem.read("app/navigation/Drawer.tsx")
        expect(content).not.toContain("Example")
      })
      it("adds to Primary but not Drawer", async () => {
        toolbox.parameters.first = "Example"
        await selectOnlyPrimaryNavigation(io)
        await run(toolbox)
        // assertions
        const { filesystem } = toolbox
        let content = filesystem.read("app/navigation/Primary.tsx")
        expect(content).toContain("Example")
        content = filesystem.read("app/navigation/Drawer.tsx")
        expect(content).not.toContain("Example")
      })
      it("adds to Drawer but not Primary", async () => {
        toolbox.parameters.first = "Example"
        await selectOnlyDrawerNavigation(io)
        await run(toolbox)
        // assertions
        const { filesystem } = toolbox
        let content = filesystem.read("app/navigation/Primary.tsx")
        expect(content).not.toContain("Example")
        content = filesystem.read("app/navigation/Drawer.tsx")
        expect(content).toContain("Example")
      })
      it("adds to Drawer and Primary", async () => {
        toolbox.parameters.first = "Example"
        await selectDrawerAndPrimaryNavigation(io)
        await run(toolbox)
        // assertions
        const { filesystem } = toolbox
        let content = filesystem.read("app/navigation/Primary.tsx")
        expect(content).toContain("Example")
        content = filesystem.read("app/navigation/Drawer.tsx")
        expect(content).toContain("Example")
      })
    })
  })
  describe("run() State Machine boilerplate selection", () => {
    beforeEach(async () => {
      toolbox = createBoilerplateToolbox({ cwd: originalDir })
      toolbox.parameters.first = "Example"
    })
    it("index.tsx has Redux state but not MST state", async () => {
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
      // No need to for Navigation at this time
      await selectNoNavigation(io)
      // generate screen
      await run(toolbox)
      // assertions
      const { filesystem } = toolbox
      const content = filesystem.read("app/screens/Example/index.tsx")
      // Does not MST
      expect(content).not.toContain("import { useStores } from '../../models'")
      expect(content).not.toContain("const rootStore, { someStore, anotherStore } = useStores()")
      expect(content).not.toContain("mobx")
      // Does have connectors for Redux
      expect(content).toContain("createScreen('Example', (props) => {")
      expect(content).toContain("// const { usersList } = props")
    })
    it("index.tsx has MST state but not Redux state", async () => {
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
        useStateMachineMST: true,
        useNativeBase: true,
      }
      await generateProject(toolbox, templateProps, originalDir)
      // No need to for Navigation at this time
      await selectNoNavigation(io)
      // generate screen
      await run(toolbox)
      // assertions
      const { filesystem } = toolbox
      const content = filesystem.read("app/screens/Example/index.tsx")
      // Does have connectors for MST
      expect(content).toContain("import { useStores } from '../../models'")
      expect(content).toContain("const rootStore, { someStore, anotherStore } = useStores()")
      expect(content).toContain("mobx")
      // Does not have connections to Redux
      expect(content).not.toContain("createScreen('Example', (props) => {")
      expect(content).not.toContain("// const { usersList } = props")
    })
    it("does not contain TODO note about Redux", async () => {
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
      // No need to for Navigation at this time
      await selectNoNavigation(io)
      // generate screen
      await run(toolbox)
      // assertions
      const { filesystem } = toolbox
      const content = filesystem.read("app/screens/Example/index.tsx")
      expect(content).not.toContain("// TODO Support Redux React Hooks")
    })
  })
})
