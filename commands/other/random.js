const { Command } = require('discord.js-commando');

module.exports = class RandomNumberCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'random',
      aliases: ['rnd', 'rand'],
      memberName: 'random',
      group: 'other',
      description: 'Генерирует рандомное число от одного до другого',
      args: [
        {
          key: 'min',
          prompt: 'Число от?',
          type: 'integer'
        },
        {
          key: 'max',
          prompt: 'Число до?',
          type: 'integer'
        }
      ]
    });
  }

  run(message, { min, max }) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return message.say(Math.floor(Math.random() * (max - min + 1)) + min);
  }
};