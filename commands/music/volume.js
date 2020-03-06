const { Command } = require('discord.js-commando');

module.exports = class VolumeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'volume',
      aliases: ['change-volume'],
      memberName: 'volume',
      group: 'music',
      description: 'Меняет текущую громкость',
      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 5
      },
      args: [
        {
          key: 'wantedVolume',
          prompt: 'Укажите громкость (от 1 до 200)',
          type: 'integer',
          validate: wantedVolume => wantedVolume >= 1 && wantedVolume <= 200
        }
      ]
    });
  }

  run(message, { wantedVolume }) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('Войдите в голосовой канал и попробуйте снова');

    if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher == null
    ) {
      return message.reply('Сейчас ничего не играет!');
    }
    const volume = wantedVolume / 100;
	message.guild.musicData.volume = volume;
    message.guild.musicData.songDispatcher.setVolume(volume);
	message.say(`Текущая громкость: ${wantedVolume}%`);
  }
};