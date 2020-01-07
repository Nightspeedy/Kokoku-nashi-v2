const Command = require('@lib/command');
const TYPES = require('@lib/types');
const ERROR = require('@lib/errors');
const {RichEmbed} = require('discord.js');
const {Member} = require('@lib/models');

module.exports = class extends Command {
  constructor(bot) {
    super({
      name: 'top',
      description: 'List the top 10 users based on reputation or level.',
      type: TYPES.SOCIAL,
      args: '["level" or "reputation"]',
    }); // Pass the appropriate command information to the base class.

    this.bot = bot;
  }

  async run({message, args, guild, color}) {
    let order = 'reputation';

    if (args && args[0] && args[0].charAt(0) == 'l') {
      order='level';
      var collection = await Member.aggregate([{$sort: {level: -1, exp: -1, reputation: -1}}, {$limit: 10}]); // Sort by Level first
    } else {
      var collection = await Member.aggregate([{$sort: {reputation: -1, level: -1, exp: -1}}, {$limit: 10}]); // Sort by Rep first
    }

    const embed = new RichEmbed().setColor(color).setDescription(`Top 10 ${order} of users`);

    for (var i = 0; i < collection.length; i++) {
      const userData = collection[i];
      const user = await this.bot.fetchUser(userData.id);
      console.log(user)

      const fieldText = order == 'level' ?
       `Level: ${userData.level}\nExperience: ${userData.exp}` :
       `Reputation: ${userData.reputation}`;

      embed.addField(`${user.username}#${user.discriminator}`, fieldText);
    }

    message.channel.send(embed);
  }
};
