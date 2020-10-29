import * as stdMocks from "std-mocks"
import * as fs from "fs"
import * as JetPack from 'fs-jetpack'
import { Volume } from "memfs"
import { run } from "../../../src/commands/generate/screen"
import { createBoilerplateToolbox } from "../../testUtils"
import Console, { ConsoleMethod } from "../../testUtils/Console"

const screensFileContent = fs.readFileSync(process.cwd() + '/boilerplate/app/screens/index.ts', { encoding: 'utf8' })

jest.mock('fs', () => {
  const fs = jest.requireActual(`fs`)
  const unionfs = require(`unionfs`).default
  return unionfs.use(fs)
})

describe('Generate Screen', () => {
  let vol = null
  const consoleSpies = new Console(console)
  beforeAll(() => {
    stdMocks.use()
  })
  afterAll(() => {
    stdMocks.restore()
  })
  beforeEach(() => {
    consoleSpies.mock([ConsoleMethod.log])
    vol = Volume.fromJSON(
      {
        "app/screens/ExampleScreen/index.tsx": '',
        "app/screens/index.ts": screensFileContent,
      },
      process.cwd()
    )
    const fsMock: any = fs
    fsMock.use(vol)
  })
  afterEach(() => {
    consoleSpies.restore()
  })
  describe('Bug with fs-jetpack', () => {
    it('is able to write with mode=undefined being set to a default', async () => {
      await JetPack.writeAsync('app/screens/ExampleScreen/index.tsx', 'sdfgsdgsdfgsdfgdf')
    })
  })
  describe('run()', () => {
    it('notifies user that name is required and stops', async () => {
      const toolbox = createBoilerplateToolbox()
      await run(toolbox)

      expect(console.log).toHaveBeenCalledTimes(2)
      expect(console.log).toHaveProperty('mock.calls')
      expect(consoleSpies.log.mock.calls[0][0]).toContain('A name is required.')
    })
    it('writes CamelCased Screen', async () => {
      const toolbox = createBoilerplateToolbox()
      expect(toolbox).toHaveProperty('parameters')
      toolbox.parameters.first = 'Example'
      expect(toolbox).toHaveProperty('parameters.first')
      await run(toolbox)
      expect(consoleSpies.log.mock.calls[0][0]).not.toContain('A name is required.')
      expect(vol.toJSON()).toEqual({ '/foo': 'bar' })
    })
  })
})
