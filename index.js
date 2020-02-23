const { CommandoClient } = require('discord.js-commando');
const { Structures } = require('discord.js');
const path = require('path');
const { prefix, token } = require('./config.json');

Structures.extend('Guild', Guild => {
  class MusicGuild extends Guild {
    constructor(client, data) {
      super(client, data);
      this.musicData = {
        queue: [],
        isPlaying: false,
        nowPlaying: null,
        songDispatcher: null,
        volume: 1
      };
      this.triviaData = {
        isTriviaRunning: false,
        wasTriviaEndCalled: false,
        triviaQueue: [],
        triviaScore: new Map()
      };
    }
  }
  return MusicGuild;
});

const client = new CommandoClient({
  commandPrefix: prefix,
  owner: 'Your Owner ID' // поменяйте это на ваш Discord userID
});

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['music', 'Музыка'],
    ['gifs', 'Гиф'],
    ['guild', 'Сервер'],
    ['other', 'Другие команды']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
  console.log('I am ready!');
  client.user.setActivity(';help', { 
    type :'STREAMING',
    url: 'https://twitch.tv/test'
  })
});


client.login(token);