import { read, write } from 'fs-jetpack'
import { run } from "../../../src/commands/generate/screen"
import { createBoilerplateToolbox, getTemplateProps, Plugins } from "../../testUtils"
import Console, { ConsoleMethod } from "../../testUtils/Console"
import { generateBoilerplate } from "../../../src/lib/boilerplate"
import temp = require('temp')
import mockProcess = require('jest-mock-process')

const originalDir = process.cwd()
const projectPackage = read(originalDir + '/package.json')
describe('Generate Screen', () => {
  const consoleSpies = new Console(console)
  let mockExit = null
  let toolbox = null
  let templateProps = null
  beforeAll(() => {
    temp.track()
  })
  beforeEach(async () => {
    consoleSpies.mock([ConsoleMethod.log])
    mockExit = mockProcess.mockProcessExit()
    const tempDir = temp.mkdirSync('temp')
    process.chdir(tempDir)
    write(process.cwd() + '/package.json', projectPackage)
    toolbox = createBoilerplateToolbox({ cwd: originalDir })
    templateProps = getTemplateProps(toolbox, JSON.parse(projectPackage))
    await generateBoilerplate(toolbox, templateProps, originalDir, new Plugins(toolbox))
  })
  afterEach(() => {
    consoleSpies.restore()
    temp.cleanupSync()
    process.chdir(originalDir)
    mockExit.mockRestore()
  })
  describe('run()', () => {
    it('notifies user that name is required and stops', async () => {
      await run(toolbox)
      expect(console.log).toHaveBeenCalledTimes(2)
      expect(console.log).toHaveProperty('mock.calls')
      expect(consoleSpies.log.mock.calls[0][0]).toContain('A name is required.')
    })
    it('writes CamelCased Screen', async () => {
      toolbox.parameters.first = 'Example'
      const { filesystem } = toolbox
      await run(toolbox)
      expect(consoleSpies.log.mock.calls[0][0]).not.toContain('A name is required.')
      let dirs = filesystem.subdirectories('.')
      expect(dirs).toContain('app')
      dirs = filesystem.subdirectories('./app')
      expect(dirs).toContain('app/screens')
      expect(filesystem.list('app/screens')).toContain('ExampleScreen')
    })
    it('writes content into index.tsx that uses createScreen()', async () => {
      toolbox.parameters.first = 'Example'
      const { filesystem } = toolbox
      await run(toolbox)
      expect(filesystem.exists('./app/screens/ExampleScreen/index.tsx')).toBeTruthy()
      const content = filesystem.read('app/screens/ExampleScreen/index.tsx')
      expect(content).toContain('export default createScreen(\'ExampleScreen\'')
    })
  })
})
