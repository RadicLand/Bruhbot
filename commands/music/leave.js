const { Command } = require('discord.js-commando');

module.exports = class LeaveCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'leave',
      aliases: ['end'],
      group: 'music',
      memberName: 'leave',
      guildOnly: true,
      description: 'Выходит из голосового канала'
    });
  }

  run(message) {
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('Войдите в голосовой канал и попробуйте снова');

    if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher == null
    ) {
      return message.reply('Сейчас ничего не играет!');
    }
    if (!message.guild.musicData.queue)
      return message.say('Сейчас нет треков в очереди');
    message.guild.musicData.songDispatcher.end();
    message.guild.musicData.queue.length = 0;
    return;
  }
};