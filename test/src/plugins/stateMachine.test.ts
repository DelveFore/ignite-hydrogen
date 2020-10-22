import { stdin } from 'mock-stdin'
import * as stdMocks from 'std-mocks'
import { Toolbox } from "gluegun/build/domain/toolbox"
import { prompt } from 'gluegun/prompt'
import StateMachinePlugin, { OPTIONS } from "../../../src/plugins/stateMachine"
import { KEYS, sendKeystrokes, delay } from "../../testUtils/cli"

describe('Boilerplate Plugin StateMachine', () => {
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
    it('prompts and returns selected for Redux (SagaSauce)', async () => {
      const toolbox = new Toolbox()
      toolbox.prompt = prompt
      sendKeystrokes(async () => {
        io.send(KEYS.Enter)
        await delay(10)
      })
      const plugin = new StateMachinePlugin(toolbox)
      const result = await plugin.select()
      const stdoutResult = stdMocks.flush().stdout
      expect(stdoutResult[1]).toContain('What State Machine do you want to use')
      expect(stdoutResult[1]).toContain('Redux + SagaSauce')
      expect(result).toHaveProperty('selected', OPTIONS.SAGA_SAUCE)
      expect(plugin.selected).toEqual(OPTIONS.SAGA_SAUCE)
    })
  })
})
