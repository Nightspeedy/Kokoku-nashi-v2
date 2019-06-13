const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')
const { Permission } = require('@lib/models') // eslint-disable-line
// const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'permission',
      aliases: ['perm'],
      description: 'Manage permissions, give a specific role access to a specific command.',
      type: TYPES.GUILD_OWNER,
      args: '{set, list} {role name/id} {permission} {true/false}',
      permissions: [PERMISSIONS.GUILD_OWNER]
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async set ({ message, args }) {
    let role = message.guild.roles.find(role => role[typeof (args[1]) === 'number' ? 'id' : 'name'] === args[1])
    if (!role) return this.error({ message: `I couldn't find the permission "${args[1]}"` }, { message, args })

    let permission = await Permission.findOne({ guild: message.guild.id, role: role.id })
    if (!permission) {
      permission = await Permission.create({ guild: message.guild.id, role: role.id, granted: [] })
    }

    let permName = Object.keys(PERMISSIONS).find(name => name === args[2].toUpperCase())
    if (!permName) return this.error({ message: `I couldn't find the permission "${args[2]}"` }, { message, args })

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

  // very basic, make prettier later
  async list ({ message, args }) {
    let fields = []

    let rules = await Permission.find({ guild: message.guild.id })

    if (args[1]) {
      rules.filter(rule => message.guild.roles.find(r => r.id === rule.role).name === args[1]).forEach(rule => {
        fields.push({
          name: message.guild.roles.find(r => r.id === rule.role).name || rule.role,
          value: rule.granted.map(perm => `\`${perm}\``).join(' ')
        })
      })
    } else {
      fields.push({
        name: 'Available Permissions',
        value: Object.keys(PERMISSIONS).map(perm => `\`${perm}\``).join(' ')
      })
      fields.push({
        name: 'Roles with custom rules',
        value: rules.map(rule => `\`${message.guild.roles.find(r => r.id === rule.role).name || rule.role}\``).join(' ')
      })
    }

    return message.channel.send({
      embed: {
        color: this.color,
        author: {
          name: 'Permissions',
          icon_url: 'https://cdn.discordapp.com/embed/avatars/1.png'
        },
        fields: fields
      }
    })
  }

  async run ({ message, args }) {
    if (!args[0]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })
    switch (args[0].toLowerCase()) {
      case 'set': await this.set({ message, args }); break
      case 'list': await this.list({ message, args }); break
      default: return this.error(ERROR.INVALID_ARGUMENTS, { message, args })
    }
  }
}
