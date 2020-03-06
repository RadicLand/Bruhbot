const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class BanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      aliases: ['ban-member', 'ban-hammer'],
      memberName: 'ban',
      group: 'guild',
      description: 'Банит указанного участника',
	  ownerOnly: true,
      guildOnly: true,
      userPermissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
      args: [
        {
          key: 'userToBan',
          prompt:
            'Отправьте никнейм с знаком @ или его userID',
          type: 'string'
        },
        {
          key: 'reason',
          prompt: 'Укажите причину блокировки:',
          type: 'string'
        }
      ]
    });
  }

  run(message, { userToBan, reason }) {
    const user =
      message.mentions.members.first() || message.guild.members.get(userToBan);
    if (user == undefined)
      return message.channel.send('Проверьте никнейм и попробуйте снова');
    user
      .ban(reason)
      .then(() => {
        const banEmbed = new MessageEmbed()
          .addField('Забанил:', userToBan)
          .addField('Причина:', reason)
          .setColor('#420626');
        message.channel.send(banEmbed);
      })
      .catch(e => {
        message.say(
          'Что-то пошло не так, скорее всего у меня нет разрешений на блокировку :('
        );
        return console.error(e);
      });
  }
};