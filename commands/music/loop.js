const { Command } = require('discord.js-commando');

module.exports = class LoopCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'loop',
	  aliases: ['repeat'],
      memberName: 'loop',
      group: 'music',
      description: 'Ставит текущий трек на повтор',
      guildOnly: true
    });
  }

  run(message) {
    if (!message.guild.musicData.isPlaying) {
      return message.say('Сейчас ничего не играет!');
    } else if (
      message.guild.musicData.isPlaying &&
      message.guild.triviaData.isTriviaRunning
    ) {
      return message.say('Нельзя поставить на повтор трек из Тривии!');
    }

    message.channel.send(
      `${message.guild.musicData.nowPlaying.title} добавлен в очередь`
    );
    message.guild.musicData.queue.unshift(message.guild.musicData.nowPlaying);
    return;
  }
};