const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const fs = require('fs');
const JSONArrayT = require('../../resources/gachi/gachi.json')
const JSONArray = fs.readFileSync('resources/gachi/gachi.json','utf8');

module.exports = class MusicTriviaCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'gachi',
      memberName: 'gachi',
      group: 'gachi',
      description: 'Включает рандомный гачи трек!',
      guildOnly: true,
      clientPermissions: ['SPEAK', 'CONNECT'],
      throttling: {
        usages: 1,
        duration: 10
      },
      args: [
        {
          key: 'tracksAmount',
		  prompt: `Какое количество треков? Максимум ${JSONArrayT.gachimuchi.length}`,
          type: 'integer',
          validate: tracksAmount => tracksAmount >= 1 && tracksAmount <= JSONArrayT.gachimuchi.length
        }
      ]
    });
  }

  async run(message, { tracksAmount }) {

    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.say('Войдите в голосовой канал и попробуйте снова');

    if (message.guild.musicData.isPlaying === true)
      return message.channel.send('Какой-то трек уже играет : (');
    message.guild.musicData.isPlaying = true;

    var videoDataArray = JSON.parse(JSONArray).gachimuchi;
    var numOfLinks = tracksAmount
    const randomXVideoLinks = this.getRandom(videoDataArray, numOfLinks);

    message.say(`♂♂♂ Ну что, братанчик, пора получать шлепки по жопе? ♂♂♂`);

    for (let i = 0; i < randomXVideoLinks.length; i++) {
      const gachi = {
        url: randomXVideoLinks[i].url,
        title: randomXVideoLinks[i].name,
        voiceChannel
      };
      message.guild.musicData.queue.push(gachi);
    }
    this.playSong(message.guild.musicData.queue, message);
  }

  playSong(queue, message) {
    queue[0].voiceChannel.join().then(connection => {
      const dispatcher = connection
        .play(
          ytdl(queue[0].url, {
            quality: 'highestaudio',
            highWaterMark: 1024 * 1024 * 1024
          })
        )
        .on('start', () => {
			
		  const gachiembed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle(`♂♂♂ Текущий трек: ♂♂♂`)
			.addBlankField()
			.setDescription(`${queue[0].title}`)
			.setAuthor('Bruhbot', 'https://cdn.discordapp.com/avatars/659585168402546698/27b07eecd6091b380cc31417bfd85c47.webp')
			.setThumbnail('https://media1.tenor.com/images/7c49baca66503ff310827d0c92493d93/tenor.gif')
			.addBlankField()
			.setImage('https://media1.tenor.com/images/6f17c39ddaa1138940523377bca75412/tenor.gif')
			.setTimestamp()
			
		  message.say(gachiembed);
		  //message.say(``)
		  //message.say(`https://media1.tenor.com/images/6f17c39ddaa1138940523377bca75412/tenor.gif`)
          message.guild.musicData.songDispatcher = dispatcher;
		  dispatcher.setVolume(message.guild.musicData.volume);
		  return queue.shift();
        })
        .on('finish', () => {
          if (queue.length >= 1) {
            return this.playSong(queue, message);
          }
		  else 
		  {
            message.guild.musicData.isPlaying = false;
            message.guild.musicData.nowPlaying = null;
            return message.guild.me.voice.channel.leave();
          }
        })
      })
    };
	
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
};