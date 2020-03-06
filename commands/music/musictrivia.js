const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const fs = require('fs');
const trackslength = JSON.parse(fs.readFileSync('resources/music/musictrivia.json', 'utf8')).songs.length

module.exports = class MusicTriviaCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'music-trivia',
      aliases: ['musictrivia', 'trivia', 'mt'],
      memberName: 'music-trivia',
      group: 'music',
      description: 'Попробуйте угадать треки с друзьями!',
      guildOnly: true,
      clientPermissions: ['SPEAK', 'CONNECT'],
      throttling: {
        usages: 1,
        duration: 10
      },
      args: [
        {
          key: 'tracksAmount',
		  prompt: `Какое количество треков для Тривии вы хотите? Максимум ${trackslength}`,
          type: 'integer',
          validate: tracksAmount => tracksAmount >= 1 && tracksAmount <= trackslength
        }
      ]
    });
  }

  async run(message, { tracksAmount }) {
    // check if user is in a voice channel
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.say('Войдите в голосовой канал и попробуйте снова');
    if (message.guild.musicData.isPlaying === true)
      return message.channel.send('Тривия или какой-то другой трек уже играет');
    message.guild.musicData.isPlaying = true;
    message.guild.triviaData.isTriviaRunning = true;
    // fetch link array from txt file
    const jsonSongs = fs.readFileSync(
      'resources/music/musictrivia.json',
      'utf8'
    );
    var videoDataArray = JSON.parse(jsonSongs).songs;
    // get random x videos from array
    var numOfLinks = tracksAmount
    const randomXVideoLinks = this.getRandom(videoDataArray, numOfLinks); // get x random urls
    // create and send info embed
    const infoEmbed = new MessageEmbed()
      .setColor('#ff7373')
      .setTitle('Начинаем!')
      .setDescription(
        `Готовьтесь! ${numOfLinks} треков, у вас будет 60 секунд, чтобы угадать певца/группу или название трека. Удачи!
        Вы можете закончить Тривию написав команду ;et в любой момент!`
      );
    message.say(infoEmbed);
    // init quiz queue
    // turn each vid to song object

    for (let i = 0; i < randomXVideoLinks.length; i++) {
      const song = {
        url: randomXVideoLinks[i].url,
        singer: randomXVideoLinks[i].singer,
        title: randomXVideoLinks[i].title,
        voiceChannel
      };
      message.guild.triviaData.triviaQueue.push(song);
    }
    const channelInfo = Array.from(
      message.member.voice.channel.members.entries()
    );
    channelInfo.forEach(user => {
      message.guild.triviaData.triviaScore.set(user[1].user.username, {
        score: 0
      });
    });
    this.playQuizSong(message.guild.triviaData.triviaQueue, message);
  }

	CheckSinger(message_content, queue) {
        var user_answer = message_content.toLocaleLowerCase();
        var singerArray = queue[0].singer.split(',');

        for (let i = 0; i < singerArray.length; i++) {
            singerArray[i] = singerArray[i].trim().toLocaleLowerCase();
            var singerString = `${singerArray.slice(0,i)}`.toLocaleLowerCase().replace(",", " ");

            if (singerArray[i] === user_answer || user_answer === `${singerString}`) {
                return true;
            } else {
                continue;
            }
        }
        return false;
    }

  playQuizSong(queue, message) {
    queue[0].voiceChannel.join().then(connection => {
      const dispatcher = connection
        .play(
          ytdl(queue[0].url, {
            quality: 'highestaudio',
            highWaterMark: 1024 * 1024 * 1024
          })
        )
        .on('start', () => {
          message.guild.musicData.songDispatcher = dispatcher;
		  dispatcher.setVolume(message.guild.musicData.volume);
          let songNameFound = false;
          let songSingerFound = false;

          const filter = m =>
            message.guild.triviaData.triviaScore.has(m.author.username);
          const collector = message.channel.createMessageCollector(filter, {
            time: 60000
          });

          collector.on('collect', m => {
            if (!message.guild.triviaData.triviaScore.has(m.author.username))
              return;
            if (m.content.startsWith(this.client.commandPrefix)) return;
            // if user guessed song name
            if (m.content.toLowerCase() === queue[0].title.toLowerCase()) {
              if (songNameFound) return; // if song name already found
              songNameFound = true;

              if (songNameFound && songSingerFound) {
                message.guild.triviaData.triviaScore.get(m.author.username)
                  .score++;
                  m.react('☑');
                  m.reply(`Вы угадали! :orange_square: Это было ${queue[0].singer} - ${queue[0].title} :orange_square:`);
                return collector.stop();
              }
              message.guild.triviaData.triviaScore.get(m.author.username)
                  .score++;
                  m.react('☑');
                  m.reply(`Вы угадали! :orange_square: Это было ${queue[0].singer} - ${queue[0].title} :orange_square:`);
                return collector.stop();
            }
            // if user guessed singer
            else if (this.CheckSinger(m.content, queue)) {
              if (songSingerFound) return;
              songSingerFound = true;
              if (songNameFound && songSingerFound) {
                message.guild.triviaData.triviaScore.get(m.author.username)
                  .score++;
                  m.react('☑');
                  m.reply(`Вы угадали! :orange_square: Это было ${queue[0].singer} - ${queue[0].title} :orange_square:`);
                return collector.stop();
              }

                message.guild.triviaData.triviaScore.get(m.author.username)
                  .score++;
                  m.react('☑');
                  m.reply(`Вы угадали! :orange_square: Это было ${queue[0].singer} - ${queue[0].title} :orange_square:`);
                return collector.stop();
            } else if (
              m.content.toLowerCase() ===
                this.CheckSinger(m.content, queue) + ' ' + queue[0].title.toLowerCase() ||
              m.content.toLowerCase() === queue[0].title.toLowerCase() + ' ' + this.CheckSinger(m.content, queue)
            ) {
              if (
                (songSingerFound && !songNameFound) ||
                (songNameFound && !songSingerFound)
              ) {
                message.guild.triviaData.triviaScore.get(m.author.username)
                  .score++;
                  m.react('☑');
                  m.reply(`Вы угадали! :orange_square: Это было ${queue[0].singer} - ${queue[0].title} :orange_square:`);
                return collector.stop();
              }
              message.guild.triviaData.triviaScore.get(
                m.author.username
              ).score =
                message.guild.triviaData.triviaScore.get(m.author.username)
                  .score + 2;
                  m.react('☑');
                return collector.stop();
            } else {
              // wrong answer
              return m.react('❌');
            }
          });

          collector.on('end', () => {
            /*
            The reason for this if statement is that we don't want to get an
            empty embed returned via chat by the bot if end-trivia command was called
            */
            if (message.guild.triviaData.wasTriviaEndCalled) {
              message.guild.triviaData.wasTriviaEndCalled = false;
              return;
            }
            message.channel.send(
              this.scoreEmbed(
                Array.from(message.guild.triviaData.triviaScore.entries())
              )
            );
            if((songNameFound === false) && (songSingerFound === false))
            message.say(`Никто не угадал! Это было :orange_square: ${queue[0].singer} - ${queue[0].title} :orange_square:`)
            queue.shift();
            dispatcher.end();
            return;
          });
        })
        .on('end', () => {
          if (queue.length >= 1) {
            return this.playQuizSong(queue, message);
          } else {
            if (message.guild.triviaData.wasTriviaEndCalled) {
              message.guild.musicData.isPlaying = false;
              message.guild.triviaData.isTriviaRunning = false;
              message.guild.triviaData.triviaScore.clear();
              message.guild.me.voice.channel.leave();
              return;
            }
            let highestTriviaScore = 0;
            let winner = '';
            let isHighestValueDuplicate = false;

            Array.from(message.guild.triviaData.triviaScore.entries()).map(
              entry => {
                if (entry[1].score > highestTriviaScore) {
                  highestTriviaScore = entry[1].score;
                  winner = entry[0];
                  isHighestValueDuplicate = false;
                } else if (entry[1].score == highestTriviaScore) {
                  isHighestValueDuplicate = true;
                }
              }
            );
            if (highestTriviaScore == 0 || isHighestValueDuplicate) {
              message.guild.musicData.isPlaying = false;
              message.guild.triviaData.isTriviaRunning = false;
              message.guild.triviaData.triviaScore.clear();
              message.guild.me.voice.channel.leave();
              return message.channel.send('Никто не выиграл. Удачи в следующий раз!');
            } else {
              message.channel.send(
                `Победителем стал ${winner} с ${highestTriviaScore} очков! :clap: :clap: :clap: `
              );
              message.guild.musicData.isPlaying = false;
              message.guild.triviaData.isTriviaRunning = false;
              message.guild.triviaData.triviaScore.clear();
              message.guild.me.voice.channel.leave();
              return;
            }
          }
        });
    });
  }

  getRandom(arr, n) {
    var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
    if (n > len)
      throw new RangeError('getRandom: more elements taken than available');
    while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }

  scoreEmbed(arr) {
    if (!arr) return;

    // create an embed with no fields
    const embed = new MessageEmbed()
      .setColor('#ff7373')
      .setTitle('Текущий счёт Тривии');

    for (let i = 0; i < arr.length; i++) {
      embed.addField(arr[i][0] + ':', arr[i][1].score);
    }

    return embed;
  }
};