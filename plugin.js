const { version } = require('./package.json')
const NPM_MODULE_NAME = 'hydrogen'
const NPM_MODULE_VERSION = version

/**
 * Add the plugin.
 *
 * @param {any} context - The gluegun context.
 */
async function add(context) {
  // examples of generated screens
  await context.ignite.addModule(NPM_MODULE_NAME, { link: true, version: NPM_MODULE_VERSION })
}

/**
 * Remove the plugin.
 *
 * @param {any} context - The gluegun context.
 */
async function remove(context) {
  // remove screens
  await context.ignite.removeModule(NPM_MODULE_NAME, { unlink: true })
}

module.exports = { add, remove }
