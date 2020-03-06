const fetch = require('node-fetch');
const { tenorAPI } = require('../../config.json');
const { Command } = require('discord.js-commando');

module.exports = class AnimegifCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'animegif',
      aliases: ['anime-gif', 'anime-gifs'],
      memberName: 'animegif',
      group: 'gifs',
      description:
        'Отправляет гиф персонажа/аниме!',
      throttling: {
        usages: 1,
        duration: 4
      }
    });
  }

  run(message) {
    fetch(`https://api.tenor.com/v1/random?key=${tenorAPI}&q=anime&limit=1`)
      .then(res => res.json())
      .then(json => message.say(json.results[0].url))
      .catch(e => {
        message.say('Не удалось отправить гиф :slight_frown:');
        return console.error(e);
      });
  }
};