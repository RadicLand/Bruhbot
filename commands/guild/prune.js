const { Command } = require('discord.js-commando');

module.exports = class PruneCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'prune',
      aliases: ['delete', 'clear', 'nuke'],
	  memberName: 'prune',
      group: 'guild',
      description: 'Удалить до 99 сообщений',
	  ownerOnly: true,
      guildOnly: true,
      userPermissions: ['MANAGE_CHANNELS', 'MANAGE_MESSAGES'],
      args: [
        {
          key: 'deleteCount',
          prompt: 'Сколько сообщений нужно удалить? (Максимум 99)',
          type: 'integer',
          validate: deleteCount => deleteCount < 100 && deleteCount > 0
        }
      ]
    });
  }

  run(message, { deleteCount }) {
    message.channel
      .bulkDelete(deleteCount)
      .then(messages => message.say(`Удалено ${messages.size} сообщений`))
      .catch(e => {
        console.error(e);
        return message.say(
          'Что-то пошло не так при попытке удалить сообщения :('
        );
      });
  }
};