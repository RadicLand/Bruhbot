const { Command } = require('discord.js-commando');

module.exports = class SkipCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'skip',
      aliases: ['skip-song'],
      memberName: 'skip',
      group: 'music',
      description: 'Пропускает текущий трек',
      guildOnly: true
    });
  }

  run(message) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('Войдите в голосовой канал и попробуйте снова');

    if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher == null
    ) {
      return message.reply('Сейчас ничего не играет!');
    }
    message.guild.musicData.songDispatcher.end();
  }
};