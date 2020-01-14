const Command = require('@lib/command')
const TYPES = require('@lib/types')
const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'guides',
      aliases: ['guide', 'howto'],
      description: 'Got some problems setting me up? Read these guides, and get to know how to use me :D',
      type: TYPES.UTILITY,
      args: '[guideName]'
    })
    this.embed = new RichEmbed()
  }

  async run ({ message, args, color }) {
    this.embed
      .setColor(color)
    if (!args[0]) {
      this.success('List of available guides', 'settings\npermissions\nwelcome/leave', { message })
    } else {
      // TODO: Make these guides database entries, and fetch them instead of having them hard coded
      switch (args[0].toLowerCase()) {
        case 'settings':
          this.embed.setTitle('(Guide) Changing settings')
            .setDescription("Have you struggled with settings yet? No idea how to set them up? To get started, read our permissions guide first, as it will tell you how to get access to the k!settings command you will need for this guide!\n\nSo, firstly, the highlighted texts in the screenshot below are the setting names you need to use.\n\nThere are 3 different types of settings\n1: Channels\n2: Messages\n3: Toggles\n\nChannels will need you to mention a channel, for example if you want to set a welcome message channel:\n`k!settings joinleavechannel #welcome`\n\nThen there's messages:\n`k!settings welcomemessage \"Your new message in quotes.\" See k!guides welcome for options`\n\nAnd finally, there are toggles:\n`k!settings autoroles on/off`")
          await this.embed.setImage('https://cdn.discordapp.com/attachments/519032774972407828/598815521441447946/unknown.png')
          message.channel.send(this.embed).catch(e => {})
          break
        case 'permissions':
          this.embed.setTitle('(Guide) Giving, or taking permissions')
            .setDescription("Have you been wondering how to use our permission system? Can't figure it out? Here's all you need to know!\n\nTo get started: use `k!permissions list` to get a full list of available permissions, and then you can use `k!permissions set` to assign a permission to a role.\n\nThe first argument after `set` is a role name, if the role name has a space in it, surround it with \"quotation\", the next argument is the permission you want to give, or remove. followed by `true` (which will give it) or `false` (which will remove it)\n\nHere's an example:\nIf I want to give the [Developers] role access to the SETTINGS permission, I would type:\n`k!permissions set [Developers] SETTINGS true`\n where if I want to remove it. I'd set it to `false`")
          await this.embed.setImage('https://cdn.discordapp.com/attachments/519032774972407828/598807018228285440/unknown.png')
          message.channel.send(this.embed).catch(e => {})
          break
        case 'welcome/leave':
          this.embed.setTitle('(Guide) Welcomming/leaving options')
            .setDescription(`So, you've got a welcome/leave message set up. but don't know how to make the bot mention a new person, or let them know what server they joined/left. Here's how!\n\nFor starters, There are several different keywords, which will be replaced by different things:\n\n\`{MEMBER}\`This will be replaced with a mention, like this:\nWelcome <@${message.author.id}> to the server!\n\n\`{MEMBER.USERNAME}\` Will be replaced with the member's username:\nWelcome ${message.author.username} to the server!\n\n\`{MEMBER.TAG}\` will be replaced with your discriminator, or:\nWelcome ${message.author.discriminator}\n\nAnd finally we have \`{GUILD.NAME}\` which will be replaced with the server's name like this:\nWelcome <@${message.author.id}> to ${message.guild.name}`)
            .setImage('https://cdn.discordapp.com/attachments/519032774972407828/599174292890058762/unknown.png')
          message.channel.send(this.embed).catch(e => {})
          break
      }
    }
  }
}
