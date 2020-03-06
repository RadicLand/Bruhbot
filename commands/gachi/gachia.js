const { Command } = require('discord.js-commando');
const fs = require('fs');

module.exports = class TestCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'gachia',
      memberName: 'gachia',
      group: 'gachi',
      description: 'Добавление гачи трека в базу',
	  ownerOnly: true,
      args: [
        {
          key: 'gLinkUrl',
          prompt: 'Youtube URL',
          type: 'string'
        },
        {
          key: 'gName',
          prompt: 'Название',
          type: 'string'
        }
      ]
    });
  }

  run(message, { gLinkUrl, gName }) {
		
	var JSONArray = require('../../resources/gachi/gachi.json')
    var newSong = {
        url: `${gLinkUrl}`,
        name: `♂ ${gName} ♂`,
        author: `${message.author.username}#${message.author.discriminator}`
    };
    JSONArray.gachimuchi.push(newSong);
    fs.writeFile('./resources/gachi/gachi.json', JSON.stringify(JSONArray, null, 2), err => {
		message.say(`Добавлено, на данный момент уже ${JSONArray.gachimuchi.length} треков`);
        if (err) console.log(err);
    });
  }
};