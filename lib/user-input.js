const prompts = require('prompts')
const { yellow } = require('kleur')

const editions = require('./editions')

const editionQuestions = [
  {
    type: 'text',
    name: 'folder',
    message: 'What is the name/path of the folder where you are going to keep this TiddlyWiki?'
  },
  {
    type: 'select',
    name: 'withServer',
    message: 'Should this TiddlyWiki include the server components?',
    choices: [
      {
        title: 'Include Server components',
        value: true
      },
      {
        title: 'Only Browser components',
        value: false
      }
    ]
  },
  {
    type: 'select',
    name: 'edition',
    message: 'Pick the edition that you are going to use',
    choices: '<Set by function resetEditionChoices>',
    initial: '<Set by function resetEditionChoices>'
  },
  {
    type: 'confirm',
    name: 'askAgain',
    message: 'Do you want to setup another TiddlyWiki?',
    initial: false
  }
]

const runningQuestions = [
  {
    type: 'multiselect',
    name: 'runtime',
    message: 'How are you going to use your TiddlyWikis?',
    choices: [
      {
        title: 'TiddlyWiki\'s official own server',
        description: `You will run ${yellow('tiddliwiki <folderName> --listen')} to launch a single TiddlyWiki. https://tiddlywiki.com/static/WebServer.html`,
        value: 'tiddlywiki'
      },
      {
        title: 'TiddlyServer',
        description: 'You want to be able to launch several TiddlyWikis with a single command. https://arlen22.github.io/tiddlyserver/',
        value: 'tiddlyserver'
      },
      {
        title: 'Other',
        description: 'You have found your own path in https://tiddlywiki.com/#GettingStarted :-)',
        value: 'other'
      }
    ],
    min: 1,
    hint: '- Space to toggle selection. Return to submit',
    instructions: false
  }
]

const resetEditionChoices = (questions) => {
  // Looks like, when you supply a function as the value for
  // choices or initial, its return value replaces the original
  // function, so the function is only called once
  const getEditions = (prev) => {
    console.log(`prev: ${prev}`)
    return editions
      .filter(editionInfo => editionInfo.isServer === prev)
      .map(editionInfo => {
        return {
          title: editionInfo.name,
          value: editionInfo.name,
          description: editionInfo.description
        }
      })
  }
  const getInitialEditions = (prev) => editions
    .filter(editionInfo => editionInfo.isServer === prev)
    .findIndex(edition => edition.name === (prev ? 'server' : 'empty'))
  const editionPrompt = questions.find((question) => question.name === 'edition')
  editionPrompt.choices = getEditions
  editionPrompt.initial = getInitialEditions
}

const userRequirements = async () => {
  const tiddlywikis = []
  let askAgain = false
  do {
    resetEditionChoices(editionQuestions)
    const response = await prompts(editionQuestions)
    askAgain = response.askAgain
    delete response.askAgain
    tiddlywikis.push(response)
  } while (askAgain)
  const response = await prompts(runningQuestions)
  return {
    tiddlywikis,
    runtime: response.runtime
  }
}

module.exports = {
  userRequirements
}
