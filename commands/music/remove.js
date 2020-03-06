const { Command } = require('discord.js-commando');

module.exports = class RemoveSongCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'remove',
      memberName: 'remove',
      group: 'music',
      description: 'Удаляет трек из очереди',
      guildOnly: true,
      args: [
        {
          key: 'songNumber',
          prompt: 'Отправьте номер трека, который нужен удалить',
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

    message.guild.musicData.queue.splice(songNumber - 1, 1);
    return message.say(`Трек ${songNumber} удален из очереди`);
  }
};