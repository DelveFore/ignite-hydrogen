import { stdin } from 'mock-stdin'
import * as stdMocks from 'std-mocks'
import { Toolbox } from "gluegun/build/domain/toolbox"
import { prompt } from 'gluegun/prompt'
import UIPlugin, { OPTIONS } from "../../../src/plugins/ui"
import { KEYS, sendKeystrokes, delay } from "../../testUtils/cli"

describe('Boilerplate Plugin UI', () => {
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
  describe('select()', () => {
    it('prompts and returns selected for NativeBase', async () => {
      const toolbox = new Toolbox()
      toolbox.prompt = prompt
      sendKeystrokes(async () => {
        io.send(KEYS.Enter)
        await delay(10)
        io.send('y')
        await delay(10)
      })
      const plugin = new UIPlugin(toolbox)
      const result = await plugin.select()
      const stdoutResult = stdMocks.flush().stdout
      expect(stdoutResult[1]).toContain('What UI Component Library do you want to use')
      expect(stdoutResult[1]).toContain('NativeBase')
      expect(result).toHaveProperty('selected', OPTIONS.NativeBase)
      expect(plugin.selected).toEqual(OPTIONS.NativeBase)
    })
  })
})
