const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { yandexAPI } = require('../../config.json');
const ISO6391 = require('iso-639-1');
const fetch = require('node-fetch');

module.exports = class TranslateCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'translate',
      memberName: 'translate',
      group: 'other',
      description: 'Переводит отправленное сообщение используя Yandex API(только поддерживаемые языки)',
      throttling: {
        usages: 2,
        duration: 12
      },
      args: [
        {
          key: 'targetLang',
          prompt:
            'На какой язык нужен перевод?',
          type: 'string',
          validate: text => text.length < 3000
        }
      ]
    });
  }

  async run(message, { targetLang }) {
    const langCode = ISO6391.getCode(targetLang);
    if (langCode === '')
      return message.channel.send('Пожалуйста, напишите корректный язык!');

    // text needs to be less than 3000 length

    await message.channel.send(
      `Пожалуйста, отправьте текст который нужно перевести на ${targetLang}`
    );

    try {
      const filter = msg => msg.content.length > 0 && msg.content.length < 3000;
      var response = await message.channel.awaitMessages(filter, {
        max: 1,
        maxProcessed: 1,
        time: 90000,
        errors: ['time']
      });
      var text = response.first().content;
    } catch (e) {
      return message.channel.send('Вы не отправили текст!');
    }

    try {
      var res = await fetch(
        `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${yandexAPI}&text=${encodeURI(
          text
        )}&lang=${langCode}`
      );
      const json = await res.json();
      message.channel.send(embedTranslation(json.text[0]));
    } catch (e) {
      console.error(e);
      return message.say(
        'Что-то пошло не так при попытке перевести текст :('
      );
    }

    function embedTranslation(text) {
      return new MessageEmbed()
        .setColor('#FF0000')
        .setURL('http://translate.yandex.com/')
        .setDescription(text)
    }
  }
};