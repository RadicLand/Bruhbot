const { Command } = require('discord.js-commando');

module.exports = class SkipToCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'skipto',
      memberName: 'skipto',
      group: 'music',
      description:
        'Пропускает всю очередь до указанного трека, укажите номер трека в сообщении',
      guildOnly: true,
      args: [
        {
          key: 'songNumber',
          prompt:
            'Укажите номер трека: ',
          type: 'integer'
        }
      ]
    });
  }

  run(message, { songNumber }) {
    if (songNumber < 1 && songNumber >= message.guild.musicData.queue.length) {
      return message.reply('Пожалуйста, укажите правильный номер трека');
    }
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('Войдите в голосовой канал и попробуйте снова');

    if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher == null
    ) {
      return message.reply('Сейчас ничего не играет!');
    }

    if (message.guild.musicData.queue < 1)
      return message.say('Нет треков в очереди!');

    message.guild.musicData.queue.splice(0, songNumber - 1);
    message.guild.musicData.songDispatcher.end();
    return;
  }
};