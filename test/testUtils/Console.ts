import MockedFunction = jest.MockedFunction

export enum ConsoleMethod {
  error = "error",
  log = "log",
  warn = "warn",
}
export const ConsoleMethodsDefault = [ConsoleMethod.error, ConsoleMethod.log, ConsoleMethod.warn]
export const mockConsole = (
  consoleRef,
  spiesContext,
  methods: ConsoleMethod[] = ConsoleMethodsDefault,
) => {
  methods.forEach(value => {
    spiesContext[value] = jest.spyOn(consoleRef, value).mockImplementation(() => undefined)
  })
}

export default class Console {
  error: MockedFunction<any>
  log: MockedFunction<any>
  warn: MockedFunction<any>
  methods: ConsoleMethod[]
  consoleRef: any

  constructor(consoleRef) {
    this.consoleRef = consoleRef
  }

  mock = (methods: ConsoleMethod[] = ConsoleMethodsDefault) => {
    this.methods = methods
    return mockConsole(this.consoleRef, this, methods)
  }

  restore = () => {
    this.methods.forEach(method => {
      this[method].mockRestore()
    })
  }
}
