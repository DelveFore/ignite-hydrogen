import { stdin } from 'mock-stdin'
import * as stdMocks from 'std-mocks'
import { Toolbox } from "gluegun/build/domain/toolbox"
import { prompt } from 'gluegun/prompt'
import { select } from "../../../src/lib/stateMachine"
import { KEYS, sendKeystrokes, delay } from "../../testUtils/cli"

describe('StateMachine (CLI selection)', () => {
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
  describe('select', () => {
    it('prompts and returns selected for Redux (SagaSauce)', async () => {
      const toolbox = new Toolbox()
      toolbox.prompt = prompt
      sendKeystrokes(async () => {
        io.send(KEYS.Enter)
        await delay(10)
      })
      const result = await select(toolbox)
      const stdoutResult = stdMocks.flush().stdout
      expect(stdoutResult[1]).toContain('What State Machine do you want to use')
      expect(stdoutResult[1]).toContain('Redux + SagaSauce')
      expect(result).toHaveProperty('selected', 'SagaSauce')
    })
  })
})
