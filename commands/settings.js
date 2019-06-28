const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'settings',
      aliases: ['config', 'configuration'],
      description: 'Shows your guild\'s settings, or sets them.\n Command always begins with k!settings\n\nAvailable settings are:',
      args: '{setting} {setting argument}',
      type: TYPES.MOD_COMMAND,
      permissions: [PERMISSIONS.SETTINGS]
    }) // Pass the appropriate command information to the base class.

    this.fetch.guild = true

    this.bot = bot

    // Metadata for the different types,
    // right now just used for help usage
    this.types = {
      text: { usage: '{"String in quotations"}' },
      channel: { usage: '{#channelMention}' },
      toggle: { usage: '{on/off}' }
    }

    // This array contains all the possible settings
    // Type: text {name, dbField, limit, premiumLimit}
    // Type: channel {name, dbField}
    // Type: toggle {name, dbField}
    // All settings can also have {needsPremium: true} to limit a setting to premium users.
    this.settings = [
      { type: 'text', name: 'welcomemessage', prettyName: 'Welcome Message', dbField: 'welcomeMessage', limit: 100, premiumLimit: 1000 },
      { type: 'text', name: 'leavemessage', prettyName: 'Leave Message', dbField: 'leaveMessage', limit: 100, premiumLimit: 1000 },
      { type: 'text', name: 'banmessage', prettyName: 'Ban Message', dbField: 'banMessage', limit: 100, premiumLimit: 1000 },
      { type: 'channel', name: 'joinleavechannel', prettyName: 'Join/Leave Channel', dbField: 'joinLeaveChannel' },
      { type: 'toggle', name: 'sendwelcomemessages', prettyName: 'Send Welcome Messages', dbField: 'enableWelcomeMessage' },
      { type: 'toggle', name: 'sendleavemessages', prettyName: 'Send Leave Messages', dbField: 'enableLeaveMessage' }
    ]

    this.categories = [

    ]

    this.settings.forEach(setting => { this.description += `\n${setting.name} ${this.types[setting.type]}` })
  }

  // Updates a single field in a provided document.
  async update (document, field, value) {
    let update = {}
    update[field] = value
    let result = await document.updateOne(update)
    return result
  }

  // The handler for {type:text}
  // Gets the 2nd argument, can be a word of
  // a string in "quotes". If length is within
  // limits, update the guild document.
  async text ({ args, guild, setting }) {
    let value = args[1]
    if (value.length > setting[guild.isPremium ? 'premiumLimit' : 'limit']) return // error
    await this.update(guild, setting.dbField, value)
  }

  // The handler for {type:channel}
  // Gets the first mentioned channel and updates
  // the guild document if channel isnt undefined.
  async channel ({ message, guild, setting }) {
    let channel = message.mentions.channels.first()
    if (!channel) return // error
    await this.update(guild, setting.dbField, channel.id)
  }

  // The handle for {type:toggle}
  // on = true
  // anything else = false
  async toggle ({ message, args, guild, setting }) {
    let value = args[1] === 'on'
    await this.update(guild, setting.dbField, value)
  }

  async run ({ message, args, guild, color }) {
    if (!args[0]) {
      return this.overview({ message, guild })
    } else {
      // Get the setting from this.settings
      let setting = this.settings.find(setting => setting.name === args[0].toLowerCase())
      if (!setting) return this.error({ message: 'Couldn\'t find that setting.' }, { message })

      try {
        // Check if setting needs premium and, if so, the guild has premuim.
        if (setting.needsPremium && !guild.isPremium) return this.error(ERROR.NEEDS_PREMIUM, { message })

        // This class has functions named after the possible types.
        // Therefore you can do this[type]() to run the types handler.
        // Ex. {type=text}, this[setting.type]() === this.text()
        this[setting.type]({ message, args, guild, setting })

        return this.success('Setting Updated', `:ok_hand: Successfully updated \`${setting.name}\``, { message })
      } catch (e) {
        console.error(e)
        return this.error(ERROR.TRY_AGAIN, { message })
      }
    }
  }

  async overview ({ message, guild }) {
    let fields = { text: [], channel: [], toggle: [] }
    let [enabled, disabled] = ['<:Enabled:524627369386967042>', '<:Disabled:524627368757690398>']

    this.settings.forEach(setting => {
      switch (setting.type) {
        case 'text': fields.text.push(`${setting.prettyName} *[${setting.name}]*\n\`\`\`${guild[setting.dbField]}\`\`\``); break
        case 'channel': fields.channel.push(`${setting.prettyName} *[${setting.name}]*: ${guild[setting.dbField] ? `<#${guild[setting.dbField]}>` : 'No channel set.'}`); break
        case 'toggle': fields.toggle.push(`${guild[setting.dbField] ? enabled : disabled} ${setting.prettyName} *[${setting.name}]*`); break
      }
    })

    console.log(fields)

    return message.channel.send({ embed: {
      color: 0x666666,
      title: `⚙️ Guild Settings for ${message.guild.name}`,
      description: 'Here you can see all the current settings for your server :D\n',
      fields: [
        { name: 'Channels', value: fields.channel.join('\n') },
        { name: '\u200b', value: '\u200b' }, // Empty
        { name: 'Messages', value: fields.text.join('\n') },
        { name: '\u200b', value: '\u200b' }, // Empty
        { name: 'Toggles', value: fields.toggle.join('\n') },
        { name: '\u200b', value: `${guild.isPremium ? enabled : disabled} Premium` }
      ],
      timestamp: new Date()
    } })
  }
}
