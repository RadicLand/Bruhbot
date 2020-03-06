const { Command } = require('discord.js-commando');
const { newsAPI } = require('../../config.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class RuNewsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'runews',
      aliases: ['rusnews'],
      memberName: 'runews',
      group: 'other',
      description: 'Отправляет 5 последних новостей из России',
      throttling: {
        usages: 2,
        duration: 10
      }
    });
  }

  async run(message) {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?sources=google-news-ru&pageSize=5&apiKey=${newsAPI}`
      );
      const json = await response.json();
      let articleArr = json.articles;
      let processArticle = article => {
        let embed = new MessageEmbed()
          .setColor('#BA160C')
          .setTitle(article.title)
          .setURL(article.url)
          .setAuthor(article.author)
          .setDescription(article.description)
          .setThumbnail(article.urlToImage)
          .setTimestamp(article.publishedAt)
          .setFooter('by NewsAPI.org');
        return embed;
      };
      async function processArray(array) {
        for (let article of array) {
          let msg = await processArticle(article);
          message.say(msg);
        }
      }
      await processArray(articleArr);
    } catch (err) {
      message.say('Что-то пошло не так :(');
      return console.error(err);
    }
  }
};