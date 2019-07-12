
const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')
const { Member } = require('@lib/models')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'settitle',
      aliases: ['set-title', 'title'],
      description: "Set your profile title",
      type: TYPES.SOCIAL,
      args: '["New title in quotations"]',
    }) // Pass the appropriate command information to the base class.

    this.fetch.member = true

    this.bot = bot
  }

  async run ({ message, args, color, member }) {

    // Check if a user has not provided a 2nd argument
    if (args[0] && !args[1]) {

        if (args[0] == "reset") {

            await member.updateOne({title: "Nobody knows my title :O"}).catch(e => {
                return this.error(ERROR.OTHER, {message, args})
            })
            member = await Member.findOne({id: message.author.id})
            if (member.title == 'Nobody knows my title :O') {
                message.channel.send("Successfully updated profile information!").catch(e => {})
            } else {
                message.channel.send("Profile information was not updated!").catch(e => {})
            }

        } else {

            let newTitle = new String(args[0])

            if (newTitle.length > 32) return this.error({message: 'Your description may not be longer then 32 characters!'}, {message,args})

            await member.updateOne({title: args[0]}).catch(e => {
                return this.error(ERROR.OTHER, {message, args})
            })
            member = await Member.findOne({id: message.author.id})
            if (member.title == args[0]) {
                message.channel.send("Successfully updated profile information!").catch(e => {})
            } else {
                message.channel.send("Profile information was not updated!").catch(e => {})
            }
        }
    } else {
        // If a user provides a 2nd argument return this error
        return this.error(ERROR.INVALID_ARGUMENTS, {message,args})
    }

  }
}
