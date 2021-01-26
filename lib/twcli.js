const cp = require('child_process')
const path = require('path')

const twPackageFolder = require('./package-folder')('tiddlywiki')

const twScript = path.join(twPackageFolder, 'tiddlywiki.js')
const runTiddlyWiki = (params) => {
  const allParams = [twScript].concat(params)
  console.log(`tiddlywiki command params:
  ${allParams.slice(2).join(' ')}`)
  const result = cp.spawnSync(process.argv0, allParams, { stdio: 'inherit' })
  return result.status
}

module.exports = {
  create: (folder, edition) => {
    runTiddlyWiki([folder, '--init', edition])
  }
}
