import { _mergePackages } from "../../../src/lib/mergePackageJsons"

describe('mergePackageJsons', () => {
  describe('_mergePackages', () => {
    it('returns merged deps and scripts', () => {
      const EXISTING_PACKAGE = {
        scripts: {
          format: "npm-run-all format:*",
          "format:js": "prettier --write '**/*.js'",
          "format:json": "prettier --write '**/*.json'"
        },
        dependencies: {
          ramda: "^0.26.1",
          "read-pkg-up": "^7.0.0"
        },
        devDependencies: {
          "@semantic-release/git": "^7.0.17",
          "@types/jest": "^24.0.19",
          "@types/node": "^12.12.4",
          "@types/ramda": "0.26.36"
        }
      }
      const NEW_PACKAGE = {
        scripts: {
          format: "npm-run-all format:*",
          "format:js": "prettier '**/*.js'",
          compile: "tsc -p .",
          clean: "rm -rf ./build"
        },
        dependencies: {
          ramda: "^0.27.1",
          mobx: "^4.15.4"
        },
        devDependencies: {
          "@semantic-release/git": "^8.0.0",
          "@babel/plugin-proposal-decorators": "^7.0.0"
        },
        prettier: {
          printWidth: 100,
          semi: false,
          singleQuote: true,
          trailingComma: "all"
        }
      }
      const result = _mergePackages(EXISTING_PACKAGE, NEW_PACKAGE)
      expect(result).toHaveProperty('scripts', {
        format: "npm-run-all format:*",
        "format:js": "prettier '**/*.js'",
        "format:json": "prettier --write '**/*.json'",
        compile: "tsc -p .",
        clean: "rm -rf ./build"
      })
      expect(result).toHaveProperty('dependencies', {
        ramda: "^0.27.1",
        "read-pkg-up": "^7.0.0",
        mobx: "^4.15.4"
      })
      expect(result).toHaveProperty('devDependencies', {
        "@semantic-release/git": "^8.0.0",
        "@babel/plugin-proposal-decorators": "^7.0.0",
        "@types/jest": "^24.0.19",
        "@types/node": "^12.12.4",
        "@types/ramda": "0.26.36"
      })
      expect(result).toHaveProperty('prettier', {
        printWidth: 100,
        semi: false,
        singleQuote: true,
        trailingComma: "all"
      })
    })
  })
})
