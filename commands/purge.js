const Command = require('@lib/command')
const TYPES = require('@lib/types')
const PERMISSIONS = require('@lib/permissions')
const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'purge',
      description: 'Purge a specific amount of messages (maximum 1000 messages)',
      type: TYPES.MOD_COMMAND,
      args: '{amount}',
      permissions: [PERMISSIONS.PURGE]
    })
  }

  async run ({ message, args, color }) {
    if (!message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES')) { return this.error({ message: 'I couldn\'t delete messages, Do i have the MANAGE_MESSAGES permission?' }, { message }) }

    if (args[0]) {
      if (isNaN(args[0])) { return this.error({ message: `I can't purge "${args[0]}".` }, { message }) }

      let amount = Number(args[0]) + 1
      let deleted = -1

      while (amount > 0) {
        deleted += (await message.channel.bulkDelete(amount > 100 ? 100 : amount, true)).size
        amount -= 100

        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      const embed = new RichEmbed()
        .setColor(color)
        .setTitle(`Successfully purged ${deleted} messages.`)

      if (deleted !== amount - 1) {
        embed.setDescription('Some messages were not purged because they were older than 14 days.')
      }

      message.channel.send(embed).then(m => m.delete(5000))
    } else {
      const embed = new RichEmbed()
        .setColor(color)
        .setTitle('Please specify how many messages you want to purge.')

      message.channel.send(embed)
    }
  }
}
