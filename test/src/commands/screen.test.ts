import { run } from "../../../src/commands/generate/screen"
import { createBoilerplateToolbox, generateProject } from "../../testUtils"
import Console, { ConsoleMethod } from "../../testUtils/Console"
import { BoilerplateProps } from "../../../src/types"
import temp = require('temp')
import mockProcess = require('jest-mock-process')

const originalDir = process.cwd()
describe('Generate Screen', () => {
  const consoleSpies = new Console(console)
  let mockExit = null
  let toolbox = null
  beforeAll(() => {
    temp.track()
  })
  beforeEach(async () => {
    consoleSpies.mock([ConsoleMethod.log])
    mockExit = mockProcess.mockProcessExit()
    const tempDir = temp.mkdirSync('temp')
    process.chdir(tempDir)
  })
  afterEach(() => {
    consoleSpies.restore()
    temp.cleanupSync()
    process.chdir(originalDir)
    mockExit.mockRestore()
  })
  describe('run() not impacted by selections', () => {
    beforeEach(async () => {
      toolbox = createBoilerplateToolbox({ cwd: originalDir })
      const templateProps: BoilerplateProps = {
        name: toolbox.name,
        igniteVersion: '',
        reactNativeVersion: '',
        reactNativeGestureHandlerVersion: '',
        vectorIcons: false,
        animatable: false,
        i18n: false,
        includeDetox: false,
        useExpo: false,
        useStateMachineMST: false,
        useNativeBase: true
      }
      await generateProject(toolbox, templateProps, originalDir)
    })
    it('notifies user that name is required and stops', async () => {
      await run(toolbox)
      expect(console.log).toHaveBeenCalledTimes(2)
      expect(console.log).toHaveProperty('mock.calls')
      expect(consoleSpies.log.mock.calls[0][0]).toContain('A name is required.')
    })
    it('writes CamelCased Screen', async () => {
      toolbox.parameters.first = 'Example'
      await run(toolbox)
      // assertions
      const { filesystem } = toolbox
      expect(consoleSpies.log.mock.calls[0][0]).not.toContain('A name is required.')
      let dirs = filesystem.subdirectories('.')
      expect(dirs).toContain('app')
      dirs = filesystem.subdirectories('./app')
      expect(dirs).toContain('app/screens')
      expect(filesystem.list('app/screens')).toContain('Example')
    })
    it('writes content into index.tsx that uses createScreen()', async () => {
      toolbox.parameters.first = 'Example'
      await run(toolbox)
      // assertions
      const { filesystem } = toolbox
      expect(filesystem.exists('./app/screens/Example/index.tsx')).toBeTruthy()
      const content = filesystem.read('app/screens/Example/index.tsx')
      expect(content).toContain('export default createScreen(\'Example\'')
    })
    it('index.tsx does not contain ViewStyle (we are using using NativeBase)', async () => {
      toolbox.parameters.first = 'Example'
      await run(toolbox)
      // assertions
      const { filesystem } = toolbox
      const content = filesystem.read('app/screens/Example/index.tsx')
      expect(content).not.toContain('ViewStyle')
      expect(content).not.toContain('import { ViewStyle } from \'react-native\'')
      expect(content).not.toContain('import { color } from \'../../theme\'')
    })
  })
  describe('run() State Machine selection', () => {
    beforeEach(async () => {
      toolbox = createBoilerplateToolbox({ cwd: originalDir })
      toolbox.parameters.first = 'Example'
    })
    it('index.tsx has Redux state but not MST state', async () => {
      const templateProps: BoilerplateProps = {
        name: toolbox.name,
        igniteVersion: '',
        reactNativeVersion: '',
        reactNativeGestureHandlerVersion: '',
        vectorIcons: false,
        animatable: false,
        i18n: false,
        includeDetox: false,
        useExpo: false,
        useStateMachineMST: false,
        useNativeBase: true
      }
      await generateProject(toolbox, templateProps, originalDir)
      // generate screen
      await run(toolbox)
      // assertions
      const { filesystem } = toolbox
      const content = filesystem.read('app/screens/Example/index.tsx')
      // Does not MST
      expect(content).not.toContain('import { useStores } from \'../../models\'')
      expect(content).not.toContain('const rootStore, { someStore, anotherStore } = useStores()')
      expect(content).not.toContain('mobx')
      // Does have connectors for Redux
      expect(content).toContain('createScreen(\'Example\', (props) => {')
      expect(content).toContain('// const { usersList } = props')
    })
    it('index.tsx has MST state but not Redux state', async () => {
      const templateProps: BoilerplateProps = {
        name: toolbox.name,
        igniteVersion: '',
        reactNativeVersion: '',
        reactNativeGestureHandlerVersion: '',
        vectorIcons: false,
        animatable: false,
        i18n: false,
        includeDetox: false,
        useExpo: false,
        useStateMachineMST: true,
        useNativeBase: true
      }
      await generateProject(toolbox, templateProps, originalDir)
      // generate screen
      await run(toolbox)
      // assertions
      const { filesystem } = toolbox
      const content = filesystem.read('app/screens/Example/index.tsx')
      // Does have connectors for MST
      expect(content).toContain('import { useStores } from \'../../models\'')
      expect(content).toContain('const rootStore, { someStore, anotherStore } = useStores()')
      expect(content).toContain('mobx')
      // Does not have connections to Redux
      expect(content).not.toContain('createScreen(\'Example\', (props) => {')
      expect(content).not.toContain('// const { usersList } = props')
    })
    it('does not contain TODO note about Redux', async () => {
      const templateProps: BoilerplateProps = {
        name: toolbox.name,
        igniteVersion: '',
        reactNativeVersion: '',
        reactNativeGestureHandlerVersion: '',
        vectorIcons: false,
        animatable: false,
        i18n: false,
        includeDetox: false,
        useExpo: false,
        useStateMachineMST: false,
        useNativeBase: true
      }
      await generateProject(toolbox, templateProps, originalDir)
      // generate screen
      await run(toolbox)
      // assertions
      const { filesystem } = toolbox
      const content = filesystem.read('app/screens/Example/index.tsx')
      expect(content).not.toContain('// TODO Support Redux React Hooks')
    })
  })
})
