const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class KickCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      aliases: ['kick-member', 'throw'],
      memberName: 'kick',
      group: 'guild',
      description: 'Кикает указанного участника',
	  ownerOnly: true,
      guildOnly: true,
      userPermissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
      args: [
        {
          key: 'userToKick',
          prompt: 'Кого нужно кикнуть?',
          type: 'string'
        },
        {
          key: 'reason',
          prompt: 'Укажите причину кика:',
          type: 'string'
        }
      ]
    });
  }

  run(message, { userToKick, reason }) {
    const user =
      message.mentions.members.first() || message.guild.members.get(userToKick);
    if (user == undefined)
      return message.channel.send('Проверьте никнейм и попробуйте снова');
    user
      .kick(reason)
      .then(() => {
        const kickEmbed = new MessageEmbed()
          .addField('Кикнул:', userToKick)
          .addField('Причина:', reason)
          .setColor('#420626');
        message.channel.send(kickEmbed);
      })
      .catch(e => {
        message.say(
          'Что-то пошло не так, скорее всего у меня нет разрешений на кик :('
        );
        return console.error(e);
      });
  }
};