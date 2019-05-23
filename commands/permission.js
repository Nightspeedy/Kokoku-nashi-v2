
const Command = require('@lib/command')
const TYPES = require('@lib/types')
const PERMISSIONS = require('@lib/permissions')
const { Permission } = require('@lib/models') // eslint-disable-line
// const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'permission',
      description: 'Manage permissions',
      type: TYPES.GUILD_OWNER,
      args: '{set, list} {role name/id} {permission} {true/false}'
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async set ({ message, args }) {
    let role = message.guild.roles.find(role => role[typeof (args[1]) === 'number' ? 'id' : 'name'] === args[1])
    if (!role) return message.channel.send(`Error: I couldn't find the role "${args[1]}"`)

    let permission = await Permission.findOne({ guild: message.guild.id, role: role.id })
    if (!permission) {
      await Permission.create({ guild: message.guild.id, role: role.id, granted: [] })
    }

    let permName = Object.keys(PERMISSIONS).find(name => name === args[2].toUpperCase())
    if (!permName) return message.channel.send(`Error: I couldn't find the permission "${args[2]}"`)

    let shouldAdd = args[3].toLowerCase() === 'true'

    if (shouldAdd) {
      if (permission.granted.indexOf(permName) === -1) {
        await Permission.findOneAndUpdate({ guild: message.guild.id, role: role.id }, { $push: { granted: permName } })
      }
      return message.channel.send(`✅ ${role.name} has been given ${permName}`)
    } else {
      await Permission.findOneAndUpdate({ guild: message.guild.id, role: role.id }, { $pull: { granted: permName } })
      return message.channel.send(`✅ ${permName} has been revoked from ${role.name}`)
    }
  }

  async run ({ message, args }) {
    switch (args[0].toLowerCase()) {
      case 'set': await this.set({ message, args }); break
      case 'list': await this.list({ message, args }); break
    }
  }
}
