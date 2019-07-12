
const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')
const { Member } = require('@lib/models')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'setdescription',
      aliases: ['set-description', 'description'],
      description: "Set your profile title",
      type: TYPES.SOCIAL,
      args: '["New description in quotations"]',
    }) // Pass the appropriate command information to the base class.

    this.fetch.member = true

    this.bot = bot
  }

  async run ({ message, args, color, member }) {

    if (args[0] && !args[1]) {

        if (args[0] == "reset") {

            await member.updateOne({description: "Nobody knows who i am :O"}).catch(e => {
                return this.error(ERROR.OTHER, {message, args})
            })
            member = await Member.findOne({id: message.author.id})
            if (member.description == 'Nobody knows who i am :O') {
                message.channel.send("Successfully updated profile information!").catch(e => {})
            } else {
                message.channel.send("Profile information was not updated!").catch(e => {})
            }

        } else {

            let newDescription = new String(args[0])

            if (newDescription.length > 256) return this.error({message: 'Your description may not be longer then 256 characters!'}, {message,args})

            await member.updateOne({description: args[0]}).catch(e => {
                return this.error(ERROR.OTHER, {message, args})
            })
            member = await Member.findOne({id: message.author.id})
            if (member.description == args[0]) {
                message.channel.send("Successfully updated profile information!").catch(e => {})
            } else {
                message.channel.send("Profile information was not updated!").catch(e => {})
            }
        }
    } else {
        return this.error(ERROR.INVALID_ARGUMENTS, {message,args})
    }

  }
}
