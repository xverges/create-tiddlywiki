const fs = require('fs')
const path = require('path')

const twPackageFolder = require('./package-folder')('tiddlywiki')

const getFolders = source => {
  return fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => path.join(source, dirent.name))
}

const editionsFolder = path.join(twPackageFolder, 'editions')
const editions = getFolders(editionsFolder)
  .map(folder => path.join(folder, 'tiddlywiki.info'))
  .map(infoFile => {
    const info = JSON.parse(fs.readFileSync(infoFile, 'utf8'))
    return {
      name: path.basename(path.dirname(infoFile)),
      description: info.description,
      isServer: info.plugins.includes('tiddlywiki/tiddlyweb')
    }
  })

module.exports = editions
