import { createBoilerplateToolbox } from "./toolbox"

describe("Test Utils", () => {
  describe("Toolbox", () => {
    describe("createBoilerplateToolbox", () => {
      let toolbox = null
      beforeEach(() => {
        toolbox = createBoilerplateToolbox()
      })
      it("filesystem.cdw()", async () => {
        expect(toolbox).toHaveProperty("filesystem")
        expect(toolbox.filesystem.cwd()).toEqual(process.cwd())
      })
      it("plugin seem to have the Gluegun Plugin signature", () => {
        expect(toolbox).toHaveProperty("plugin")
        expect(toolbox).toHaveProperty("plugin.name", "ignite-hydrogen")
        expect(toolbox).toHaveProperty("plugin.description", null)
        expect(toolbox).toHaveProperty("plugin.defaults", {})
        expect(toolbox).toHaveProperty("plugin.directory", null)
        expect(toolbox).toHaveProperty("plugin.commands", [])
        expect(toolbox).toHaveProperty("plugin.extensions", [])
      })
      it("ignite.pluginPath()", () => {
        expect(toolbox).toHaveProperty("ignite")
        const result = toolbox.ignite.ignitePluginPath()
        expect(result).toEqual(process.cwd())
      })
    })
  })
})
