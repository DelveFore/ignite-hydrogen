import { PackageJSON } from "gluegun/build/types/toolbox/meta-types"
import ProjectInfo, { getDepVersion } from "../../../src/lib/ProjectInfo"
import * as fs from "fs"
import { Volume } from "memfs"

jest.mock("fs", () => {
  const fs = jest.requireActual(`fs`)
  const unionfs = require(`unionfs`).default
  return unionfs.use(fs)
})

describe("ProjectInfo", () => {
  describe("getDepVersion", () => {
    const info: PackageJSON = {
      dependencies: {
        mobx: "^4.15.4",
        "mobx-react-lite": "^1.4.1",
        "mobx-state-tree": "^3.14.1",
      },
    }
    const result = getDepVersion(info, "mobx")
    expect(result).toEqual("^4.15.4")
  })
  describe("hasMST", () => {
    it("returns true", () => {
      const vol = Volume.fromJSON(
        {
          "package.json": `{
            "dependencies": {
              "mobx": "^4.15.4",
              "mobx-react-lite": "^1.4.1",
              "mobx-state-tree": "^3.14.1"
            }
          }`,
        },
        process.cwd(),
      )
      const fsMock: any = fs
      fsMock.use(vol)
      expect(ProjectInfo.hasMST()).toEqual(true)
    })
    it("returns false", () => {
      const vol = Volume.fromJSON(
        {
          "package.json": `{
            "dependencies": {
              "@delvefore/sagasauce": "^1.1.0",
              "@redux-saga/is": "^1.1.2",
              "react-redux": "^7.2.1",
              "reactotron-redux": "^3.1.3",
              "reactotron-redux-saga": "^4.2.3",
              "redux": "^4.0.5",
              "redux-reset": "^0.3.0",
              "redux-saga": "^1.1.3",
              "reduxsauce": "^1.2.0",
              "seamless-immutable": "^7.1.4"
            }
          }`,
        },
        process.cwd(),
      )
      const fsMock: any = fs
      fsMock.use(vol)
      expect(ProjectInfo.hasMST()).toEqual(false)
    })
  })
  describe("hasNativeBase", () => {
    it("returns true", () => {
      const vol = Volume.fromJSON(
        {
          "package.json": `{
            "dependencies": {
              "native-base": "^2.13.12"
            }
          }`,
        },
        process.cwd(),
      )
      const fsMock: any = fs
      fsMock.use(vol)
      expect(ProjectInfo.hasNativeBase()).toEqual(true)
    })
    it("returns false", () => {
      const vol = Volume.fromJSON(
        {
          "package.json": `{
            "dependencies": {
              "react-native-paper": "^4.20.0"
            }
          }`,
        },
        process.cwd(),
      )
      const fsMock: any = fs
      fsMock.use(vol)
      expect(ProjectInfo.hasNativeBase()).toEqual(false)
    })
    it("returns true when Paper and NativeBase exist", () => {
      const vol = Volume.fromJSON(
        {
          "package.json": `{
            "dependencies": {
              "native-base": "^2.13.12",
              "react-native-paper": "^4.20.0"
            }
          }`,
        },
        process.cwd(),
      )
      const fsMock: any = fs
      fsMock.use(vol)
      expect(ProjectInfo.hasNativeBase()).toEqual(true)
    })
  })
  describe("hasReactNativePaper", () => {
    it("returns true when just Paper", () => {
      const vol = Volume.fromJSON(
        {
          "package.json": `{
            "dependencies": {
              "react-native-paper": "^4.20.0"
            }
          }`,
        },
        process.cwd(),
      )
      const fsMock: any = fs
      fsMock.use(vol)
      expect(ProjectInfo.hasReactNativePaper()).toEqual(true)
    })
    it("returns false", () => {
      const vol = Volume.fromJSON(
        {
          "package.json": `{
            "dependencies": {
              "native-base": "^2.13.12"
            }
          }`,
        },
        process.cwd(),
      )
      const fsMock: any = fs
      fsMock.use(vol)
      expect(ProjectInfo.hasReactNativePaper()).toEqual(false)
    })
    it("returns true when Paper and NativeBase exist", () => {
      const vol = Volume.fromJSON(
        {
          "package.json": `{
            "dependencies": {
              "native-base": "^2.13.12",
              "react-native-paper": "^4.20.0"
            }
          }`,
        },
        process.cwd(),
      )
      const fsMock: any = fs
      fsMock.use(vol)
      expect(ProjectInfo.hasReactNativePaper()).toEqual(true)
    })
  })
})
