const { Command } = require('discord.js-commando');

module.exports = class ResumeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'resume',
      aliases: ['continue'],
      memberName: 'resume',
      group: 'music',
      description: 'Возобновляет трек поставленный на паузу',
      guildOnly: true
    });
  }

  run(message) {
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('Войдите в голосовой канал и попробуйте снова');

    if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher === null
    ) {
      return message.reply('Сейчас ничего не играет!');
    }

    message.say('Трек возобновлен :play_pause:');

    message.guild.musicData.songDispatcher.resume();
  }
};