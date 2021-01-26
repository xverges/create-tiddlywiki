const path = require('path')
const nodeModulesPath = require('node_modules-path')

module.exports = (packageName) => path.join(nodeModulesPath(packageName), packageName)
