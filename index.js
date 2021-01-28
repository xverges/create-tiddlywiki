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
  }
  if (requirements.runtime.includes('tiddlyserver')) {
    help.push(`${indent}* start tiddlyserver running ${yellow('npx tiddlyserver --config tiddlyserver.json')}`)
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
