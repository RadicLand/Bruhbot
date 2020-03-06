const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

 //author: malokdev - https://github.com/malokdev/Crystal-bot/commit/9485022a306252efe1bb378d928bcba9d0940daa
 
module.exports = class SinfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'sinfo',
      aliases: ['serverinfo'],
      memberName: 'sinfo',
      group: 'guild',
	  description: 'Отправляет информацию о текущем сервере',
	  guildOnly: true
    });
  }

 run(message) {
    let region = {
        "russia": "Россия",
        "brazil": "Бразилия",
        "eu-central": "Центральная Европа",
        "singapore": "Сингапур",
        "us-central": "Центр США",
        "sydney": "Сидней",
        "us-east": "Восток США",
        "us-south": "Юг США",
        "us-west": "Запад США",
        "eu-west": "Западная Европа",
        "vip-us-east": "VIP Восток США",
        "london": "Лондон",
        "amsterdam": "Амстердам",
        "hongkong": "Гонконг"
    };

    var emojis;
    if (message.guild.emojis.size === 0) {
        emojis = 'None';
    } else {
        emojis = message.guild.emojis.size;
    }

    const serverinfoEmbed = new MessageEmbed()
	   .setThumbnail(message.guild.iconURL())
	   .setAuthor(message.guild.name, message.guild.iconURL() ? message.guild.iconURL() : this.client.user.displayAvatarURL())
	   .setTimestamp()
	   .addField("Создан:", `${message.guild.createdAt.toString().substr(0, 15)}`, true)
	   .addField("ID", message.guild.id, true)
	   .addField("Создатель:", `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true)
	   .addField("Регион:", region[message.guild.region], true)
	   .addField("Участников:", message.guild.members.filter(m => !m.user.bot).size, true)
	   .addField("Ботов:", message.guild.members.filter(m => m.user.bot).size, true)
	   .addField("Ролей:", message.guild.roles.size, true)
	   .addField("Каналов:", message.guild.channels.size, true)
	   .addField("Эмодзи:", `${emojis}/100`, true)
	   .setColor(Math.floor(Math.random()*16777215))
	  message.channel.send(serverinfoEmbed);
  }
};