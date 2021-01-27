const cp = require('child_process')
const fs = require('fs')
const path = require('path')

const resourcesFolder = path.join(path.dirname(__dirname), 'resources')

const getFiles = source => {
  return fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isFile())
    .map(dirent => dirent.name)
}

const copyResourceFiles = () => {
  const resourceFiles = getFiles(resourcesFolder)
  resourceFiles.forEach((fileName) => {
    if (!fs.existsSync(fileName)) {
      fs.copyFileSync(path.join(resourcesFolder, fileName), fileName)
    }
  })
}
const installTiddlywiki = () => {
  const newPackageFile = 'package.json'
  const newVersion = JSON.parse(fs.readFileSync(newPackageFile, 'utf8')).dependencies.tiddlywiki
  if (!newVersion) {
    cp.execSync('npm install tiddlywiki --package-lock-only', { stdio: 'inherit' })
  }
}

module.exports = {
  install: () => {
    copyResourceFiles()
    installTiddlywiki()
  }
}
