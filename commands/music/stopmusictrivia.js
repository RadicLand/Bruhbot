const { Command } = require('discord.js-commando');

module.exports = class StopMusicTriviaCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'stop-trivia',
      aliases: [
        'stop-music-trivia',
        'skip-trivia',
        'end-trivia',
        'stop-trivia'
      ],
      memberName: 'stop-trivia',
      group: 'music',
      description: 'Останавливает Тривию',
      guildOnly: true,
      clientPermissions: ['SPEAK', 'CONNECT']
    });
  }
  run(message) {
    if (!message.guild.triviaData.isTriviaRunning)
      return message.say('Тривия сейчас не запущена');

    if (message.guild.me.voice.channel !== message.member.voice.channel) {
      return message.say("Войдите в голосовой канал Тривии и попробуйте снова");
    }

    if (!message.guild.triviaData.triviaScore.has(message.member.displayName)) {
      return message.say(
        'Вам нужно участвовать в Тривии для того, чтобы остановить её'
      );
    }

    message.guild.triviaData.triviaQueue.length = 0;

    message.guild.triviaData.wasTriviaEndCalled = true;

    message.guild.musicData.songDispatcher.end();
    return;
  }
};