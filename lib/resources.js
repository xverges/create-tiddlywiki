const cp = require('child_process')
const fs = require('fs')
const path = require('path')

const JSON5 = require('json5')
const { bgRed } = require('kleur')

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
const installPackage = (npmPackage) => {
  const newPackageFile = 'package.json'
  const newVersion = JSON.parse(fs.readFileSync(newPackageFile, 'utf8')).dependencies[npmPackage]
  if (!newVersion) {
    cp.execSync(`npm install ${npmPackage} --package-lock-only`, { stdio: 'inherit' })
  }
}

const buildTiddlyServerConfig = (tiddlywikis) => {
  const names = tiddlywikis.map((tiddlywiki) => path.basename(tiddlywiki.folder))
  const nonDuplicates = [...new Set(names)]
  const cfgFile = 'tiddlyserver.json'
  if (nonDuplicates.length !== names.length) {
    console.log(bgRed().white('I still don\'t know how to create a TiddlyServer configuration when there are duplicate folder names :-('))
  } else if (fs.existsSync(cfgFile)) {
    console.log(bgRed().white('I still don\'t know how to update a TiddlyServer configuration file, and you already have one :-('))
  } else {
    const tree = {}
    for (let ii = 0; ii < names.length; ii++) {
      tree[names[ii]] = tiddlywikis[ii].folder
    }
    const settings = {
      tree: tree,
      bindInfo: {
        bindAddress: ['127.0.0.1']
      },
      $schema: './tiddlyserver-2-2.schema.json',
    }
    const asLines = JSON5.stringify(settings, null, 2).split('\n')
    asLines.splice(1, 0, '  // See docs at https://arlen22.github.io/tiddlyserver/docs/serverconfig.html')
    const schemaLineIndex = asLines.findIndex((line) => line.includes('$schema'))
    asLines[schemaLineIndex] = `${asLines[schemaLineIndex]} // Generate the schema file with "npx tiddlyserver gen-schema"`
    asLines.push('')
    fs.writeFileSync(cfgFile, asLines.join('\n'))
  }
}

module.exports = {
  install: (requirements) => {
    copyResourceFiles()
    installPackage('tiddlywiki')
    if (requirements.runtime.includes('tiddlyserver')) {
      installPackage('tiddlyserver')
      buildTiddlyServerConfig(requirements.tiddlywikis)
    }
  }
}
