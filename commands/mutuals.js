const Command = require('@lib/command')
const TYPES = require('@lib/types')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'mutuals',
      description: 'Get a list of guilds you share with the bot.',
      type: TYPES.UTILITY,
      args: '',
      cooldownTime: 30
    })
  }

  async run ({ message }) {
    const shared = await this.bot.utils.mutuals(message.author)
    await message.channel.send('Sending a list of mutual guilds to your DMs')
    await message.author.send({
      embed: {
        title: 'These are the guilds you share with me.',
        description: shared.map(guild => `${guild.name} [Link](https://discordapp.com/channels/${guild.id} "link to guild")`).join('\n')
      }
    })
  }
}
