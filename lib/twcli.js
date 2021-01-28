const cp = require('child_process')
const path = require('path')

const twPackageFolder = require('./package-folder')('tiddlywiki')

const twScript = path.join(twPackageFolder, 'tiddlywiki.js')
const runTiddlyWiki = (params) => {
  const allParams = [twScript].concat(params)
  console.log(`Calling
    tiddlywiki ${allParams.slice(1).join(' ')}`)
  const result = cp.spawnSync(process.argv0, allParams, { stdio: 'inherit' })
  return result.status
}

module.exports = {
  create: (folder, edition) => {
    runTiddlyWiki([folder, '--init', edition])
  }
}
