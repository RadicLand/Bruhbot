const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = class DedQuoteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'dedquote',
      aliases: ['dedquotes', 'ded'],
      group: 'other',
      memberName: 'dedquote',
      description: 'Отправляет рандомную цитату деда-футбольного мячика'
    });
  }
  run(message) {

    const jsonQuotes = fs.readFileSync(
      'resources/quotes/dedquote.json',
      'utf8'
    );
    const quoteArray = JSON.parse(jsonQuotes).quotes;

    const dedquote =
      quoteArray[Math.floor(Math.random() * quoteArray.length)];

    const quoteEmbed = new MessageEmbed()
      .setTitle(dedquote.author)
      .setDescription(dedquote.text)
      .setColor('#ff003c');
    return message.channel.send(quoteEmbed);
  }
};