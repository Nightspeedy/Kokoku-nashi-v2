const fs = require('fs')
const path = require('path')
const { Collection, RichEmbed } = require('discord.js')
const ArgumentParser = require('@lib/argumentParser')
const { CommandLogs, DisabledCommand, Eula, Strings } = require('@lib/models')
const ERROR = require('@lib/errors')

// TODO: Document and clean

module.exports = class CommandHandler {
  constructor (prefix, bot) {
    this.commands = new Collection()
    this.prefix = prefix
    this.bot = bot
    this.handle = this.handle.bind(this)
  }

  async install (dir, bot) {
    return new Promise((resolve, reject) => {
      fs.readdir(dir, (err, files) => {
        if (err) { reject(err); return }
        const jsfiles = files.filter(f => f.split('.').pop() === 'js')
        const commands = jsfiles.map(jsfile => new (require(path.join(dir, jsfile)))(bot))
        commands.forEach(command => {
          command.commandHandler = this
          command.bot = bot
          this.commands.set(command.name, command)
          console.log(`Shard #${this.bot.shard.id}: Registering command: ${command.name}`)
          command.aliases.forEach(alias => {
            this.commands.set(alias, command)
          })
        })
        resolve(this)
      })
    })
  }

  async handle (message) {
    // Used to time how long the command took to handle.
    const commandStartedAt = Date.now()

    // Checking whether or not the code should continue to run
    if (message.author.bot) return
    if (message.channel.type === 'dm') return

    if (!message.content.startsWith(this.prefix) || message.content.includes(`${this.prefix} `)) return

    // Splitting up command and arguments so they are easily usable and accessible
    const args = ArgumentParser(message.content.slice(this.prefix.length).trim(), this.bot)
    const command = args.shift()

    await this.run(command.toLowerCase(), message, args)

    global.datadog.timing('command.runtime', Date.now() - commandStartedAt)
  }

  async run (commandKey, message, args) {
    try {
      const command = this.commands.get(commandKey)
      if (!command) return

      global.datadog.increment('command.run')
      if (message.guild && await DisabledCommand.findOne({ guild: message.guild.id, command: command.name })) return

      const cooldown = await this.bot.cooldowns.get(`${commandKey}-${message.author.id}`)
      if (cooldown) return command.error(ERROR.TIMEOUT(cooldown.time), { message })

      global.datadog.increment(`command.run.${command.name}`)

      var eula = await Eula.findOne({ id: message.author.id })
      if (!eula) {
        eula = await Eula.create({ id: message.author.id })
      }
      if (!eula.accepted) return this.sendEula(eula, message)

      if (command.cooldownTime) command.cooldown(command.cooldownTime * 1000, message.author)

      command.trigger(message, args, 0x222244).catch(error => {
        console.error(error)
      })

      await CommandLogs.create({
        user: message.author.id,
        username: message.author.tag,
        command: commandKey,
        arguments: args,
        timestamp: Date.now()
      })

      global.datadog.increment('command.completed')
    } catch (error) {
      // If an error occurs with run() send it to #errors in the Kokoku Nashi server
      this.bot.channels.get('586145896874639360') && this.bot.channels.get('586145896874639360').send({
        embed: {
          title: 'An error occurred!',
          description: `An error occurred while executing \`${commandKey}\` in ${message.guild ? message.guild.name : 'channel'} (${message.guild ? message.guild.id : message.channel.id}).`,
          fields: [
            { name: 'Failed Command', value: message.content.replace(/@/g, '\\@') },
            { name: 'Error Message', value: error.message }
          ],
          timestamp: Date.now()
        }
      })

      global.datadog.increment('command.error.critical')

      return console.log(error)
    }
  }

  async sendEula (eula, message) {
    var embed = new RichEmbed()
      .setTitle('Performing first time use user setup...')
      .setDescription('Kōkoku is growing, Therefore we have created some Terms of Service, Please accept these terms before moving on!')

    const msg = await message.channel.send(embed)
    const filterOne = (reaction, user) => {
      return reaction.emoji.name === '▶️' && user.id === message.author.id
    }
    const filterTwo = (reaction, user) => {
      return ['no', 'yes'].includes(reaction.emoji.name) && user.id === message.author.id
    }
    try {
      await msg.react('▶️')
      const collected = await msg.awaitReactions(filterOne, { max: 1, time: 60000, errors: ['time'] })
      var reaction = collected.first()
      if (reaction.emoji.name === '▶️') {
        const eulaMsg = await Strings.findOne({ key: 'tos' })

        embed = new RichEmbed()
          .setTitle('Terms of Service')
          .setDescription(`\`\`\`${eulaMsg.value}\`\`\``)

        await msg.edit(embed)
        await msg.clearReactions()

        await msg.react('601850856718991370')
        await msg.react('601850856832368640')

        const collected = await msg.awaitReactions(filterTwo, { max: 1, time: 60000, errors: ['time'] })
        reaction = collected.first()

        if (reaction.emoji.id === '601850856718991370') {
          await eula.updateOne({ accepted: true })
          embed = new RichEmbed()
            .setTitle('Accepted!')
            .setColor('#32e554')
            .setDescription('Your command will now process!')

          msg.edit(embed)
          this.handle(message)
        }
        if (reaction.emoji.id === '601850856832368640') {
          embed = new RichEmbed()
            .setTitle('Command cancelled')
            .setColor('#ff3333')
            .setDescription('You must accept the EULA to continue')

          msg.edit(embed)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }
}
