const fetch = require('node-fetch');
const { tenorAPI } = require('../../config.json');
const { Command } = require('discord.js-commando');

module.exports = class CatCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'cat',
      aliases: ['cat-pic', 'cats'],
      group: 'other',
      memberName: 'cat',
      description: 'Отправляет гиф с кошкой',
      throttling: {
        usages: 2,
        duration: 10
      }
    });
  }

  run(message) {
    fetch(`https://api.tenor.com/v1/random?key=${tenorAPI}&q=cat&limit=1`)
      .then(res => res.json())
      .then(json => message.say(json.results[0].url))
      .catch(e => {
        message.say('Не удалось выполнить запрос, попробуйте снова :(');
        return console.error(e);
      });
  }
};