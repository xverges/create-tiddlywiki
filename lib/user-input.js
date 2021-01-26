const prompts = require('prompts')

const editions = require('./editions')

const questions = [
  {
    type: 'text',
    name: 'folder',
    message: 'What is the name of your new TiddlyWiki?'
  },
  {
    type: 'select',
    name: 'withServer',
    message: 'Should it include the server components?',
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
    message: 'Pick the edition you are going to use',
    choices: (prev) => editions
      .filter(editionInfo => editionInfo.isServer === prev)
      .map(editionInfo => {
        return {
          title: editionInfo.name,
          value: editionInfo.name,
          description: editionInfo.description
        }
      }),
    initial: (prev) => editions
      .filter(editionInfo => editionInfo.isServer === prev)
      .findIndex(edition => edition.name === (prev ? 'server' : 'empty'))
  }
]

const getUserInput = async () => {
  const response = await prompts(questions)
  return response
}

module.exports = getUserInput
