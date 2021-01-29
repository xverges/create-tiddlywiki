#!/usr/bin/env node

const { yellow } = require('kleur')

const { userRequirements } = require('./lib/user-input')
const twCli = require('./lib/twcli')
const resources = require('./lib/resources')

const howToStart = (requirements) => {
  const help = []
  const indent = '    '
  if (requirements.runtime.includes('tiddlywiki')) {
    help.push(`${indent}* start the tiddlywiki server running ${yellow('npx tiddlywiki ' + requirements.tiddlywikis[0].folder + ' --listen')}`)
    help.push(`${indent}  (or just ${yellow('npm start')} after updating package.json with scripts.start="tiddlywiki ${requirements.tiddlywikis[0].folder}  --listen")`)
    help.push(`${indent}  More info at https://tiddlywiki.com/static/WebServer.html`)
  }
  if (requirements.runtime.includes('tiddlyserver')) {
    help.push(`${indent}* start tiddlyserver running ${yellow('npx tiddlyserver --config tiddlyserver.json')}`)
    help.push(`${indent}  (or just ${yellow('npm start')} if you update package.json with scripts.start="tiddlyserver --config tiddlyserver.json")`)
    help.push(`${indent}  More info at https://arlen22.github.io/tiddlyserver/docs/serverconfig.html`)
  }
  if (help.length) {
    help.unshift('You can then')
  }
  return help.join('\n')
}

userRequirements().then((requirements) => {
  requirements.tiddlywikis.forEach((twSpec) => {
    twCli.create(twSpec.folder, twSpec.edition)
  })
  resources.install(requirements)
  console.log(`
    Ready!
    You can now run ${yellow('npm install')} to complete the installation.
    ${howToStart(requirements)}
  `)
})
