const { Command } = require('discord.js-commando');

module.exports = class SkipAllCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'skipall',
      aliases: ['skip-all'],
      memberName: 'skipall',
      group: 'music',
      description: 'Пропускает все треки в текущей очереди',
      guildOnly: true
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
      return message.say('Нет треков в очереди!');
    message.guild.musicData.songDispatcher.end();
    message.guild.musicData.queue.length = 0; // clear queue
    return;
  }
};