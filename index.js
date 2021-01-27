#!/usr/bin/env node

const { yellow } = require('kleur')

const userInput = require('./lib/user-input')
const twCli = require('./lib/twcli')
const resources = require('./lib/resources')

userInput().then((requirements) => {
  twCli.create(requirements.folder, requirements.edition)
  resources.install()
  console.log(`
    Ready!
    You can now run ${yellow('npm install')} to complete the installation.
    You can then start the server running ${yellow('npm run tiddlywiki -- ' + requirements.folder + ' --listen')}
  `)
})
