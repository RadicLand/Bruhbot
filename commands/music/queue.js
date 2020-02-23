const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class QueueCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'queue',
      aliases: ['song-list', 'next-songs'],
      group: 'music',
      memberName: 'queue',
      guildOnly: true,
      description: 'Показать текущую очередь треков'
    });
  }

  run(message) {
    if (message.guild.triviaData.isTriviaRunning)
      return message.say('Попробуйте снова после окончания Тривии');
    if (message.guild.musicData.queue.length == 0)
      return message.say('Нет треков в очереди!');
    const titleArray = [];
    message.guild.musicData.queue.map(obj => {
      titleArray.push(obj.title);
    });
    var queueEmbed = new MessageEmbed()
      .setColor('#ff7373')
      .setTitle('Текущая очередь:');
    for (let i = 0; i < titleArray.length; i++) {
      queueEmbed.addField(`${i + 1}:`, `${titleArray[i]}`);
    }
    return message.say(queueEmbed);
  }
};