const userInput = require('./lib/user-input')
const twCli = require('./lib/twcli')
const resources = require('./lib/resources')

userInput().then((requirements) => {
  twCli.create(requirements.folder, requirements.edition)
  resources.install()
})
