const { Command } = require('discord.js-commando');

module.exports = class SayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'say',
      aliases: ['echo', 'print'],
      memberName: 'say',
      group: 'other',
      description: 'Заставляет бота сказать что угодно :)',
      args: [
        {
          key: 'text',
          prompt: 'Что мне нужно сказать?',
          type: 'string'
        }
      ]
    });
  }

  run(message, { text }) {
	if(message.channel.type !== 'dm')
    message.channel
      .bulkDelete(1)
      .then(messages => message.say(text))
      .catch(e => {
        console.error(e);
        return message.say(
          'Не получилось отправить сообщение :('
        )
      })
	else if (message.channel.type === 'dm')
        return message.say(text)
  }
}