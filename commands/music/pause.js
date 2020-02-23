const { Command } = require('discord.js-commando');

module.exports = class PauseCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'pause',
      aliases: ['pause-song', 'hold', 'stop'],
      memberName: 'pause',
      group: 'music',
      description: 'Ставит текущий трек на паузу',
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
      return message.say('Сейчас ничего не играет!');
    }

    message.say('Пауза :pause_button:');

    message.guild.musicData.songDispatcher.pause();
  }
};