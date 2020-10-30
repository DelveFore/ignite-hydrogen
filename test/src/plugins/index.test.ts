import { stdin } from "mock-stdin"
import * as stdMocks from "std-mocks"
import Plugins from "../../../src/plugins"
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
    it("prompts for Detox, UI, and StateMachine", async () => {
      const toolbox = createBoilerplateToolbox()
      sendKeystrokes(async () => {
        io.send(KEYS.Enter)
        await delay(10)
        io.send(KEYS.Enter)
        await delay(10)
        io.send("y")
        await delay(10)
      })
      const plugins = new Plugins(toolbox)
      await plugins.select()
      const stdoutResult = stdMocks.flush().stdout
      const result = stdoutResult.join(",")
      expect(result).toContain("What State Machine do you want to use")
      expect(result).toContain("What UI Component Library do you want to use")
    })
  })
})
