const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = class RandQuoteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'randquote',
      aliases: ['randomquote'],
      group: 'other',
      memberName: 'randquote',
      description: 'Отправляет рандомную цитату'
    });
  }
  run(message) {

    const jsonQuotes = fs.readFileSync(
      'resources/quotes/randquote.json',
      'utf8'
    );
    const quoteArray = JSON.parse(jsonQuotes).quotes;

    const randomQuote =
      quoteArray[Math.floor(Math.random() * quoteArray.length)];

    const quoteEmbed = new MessageEmbed()
      .setTitle(randomQuote.author)
      .setDescription(randomQuote.text)
      .setColor('#ff003c');
    return message.channel.send(quoteEmbed);
  }
};