const fetch = require('node-fetch');
const { tenorAPI } = require('../../config.json');
const { Command } = require('discord.js-commando');

module.exports = class GifCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'gif',
      aliases: ['search-gif', 'search-gifs'],
      memberName: 'gif',
      group: 'gifs',
      description: 'Отправляет гиф по заданному запросу!',
      throttling: {
        usages: 1,
        duration: 4
      },
      args: [
        {
          key: 'text',
          prompt: 'Какую гиф вы хотите увидеть?',
          type: 'string',
          validate: text => text.length < 50
        }
      ]
    });
  }

  run(message, { text }) {
    fetch(`https://api.tenor.com/v1/random?key=${tenorAPI}&q=${text}&limit=1`)
      .then(res => res.json())
      .then(json => message.say(json.results[0].url))
      .catch(e => {
        message.say('Не удалось найти гиф по вашему запросу :(');
        return console.error(e);
      });
  }
};