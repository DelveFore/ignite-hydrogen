/**
 * TODO Test Boilerplate code
 */
import { Environment } from "./environment"
jest.mock("../config/env", () => ({}))
describe("Environment", () => {
  describe("setup()", () => {
    test("api is setup", async () => {
      const environment = new Environment()
      await environment.setup()
      expect(environment.api).toHaveProperty("users")
      expect(environment.api.users.apisauce).not.toBeFalsy()
    })
  })
})
