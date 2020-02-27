const Command = require('@lib/command')
const TYPES = require('@lib/types')
const child_process = require('child_process') //eslint-disable-line
const { Strings } = require('@lib/models')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'update',
      description: 'Pulls the latest version from GitHub and starts update sequence',
      type: TYPES.BOT_OWNER
    })
  }

  async run ({ message }) {
    this.update(message, undefined, 1)
  }

  async update (message, msg, step) {
    let childProcess, currentAction, key
    let upToDate = false

    switch (step) {
      case 1:
        currentAction = 'Checking for updates, and pulling latest version...'
        msg = await message.channel.send(currentAction)
        childProcess = await child_process.spawn('git', ['pull'])
        break
      case 2:
        currentAction = 'Installing dependencies...'
        msg = await message.channel.send(currentAction)
        childProcess = await child_process.spawn('npm', ['install'])
        break
      case 3:
        msg = await message.channel.send('Update complete, rebooting...')
        key = await Strings.findOne({ key: 'updated' })
        if (key) await key.delete()
        await Strings.create({ key: 'updated', value: `true-${msg.channel.id}-${msg.id}` })
        childProcess = await child_process.spawn('pm2', ['restart', '0'])
        break
      default:
        return
    }
    childProcess.stdout.on('data', data => {
      if (data.toString().trim() === 'Already up to date.') {
        upToDate = true
      }
    })
    childProcess.on('close', async (code) => {
      if (code !== 0) {
        msg.edit('Process exited with non-zero exit code')
      } else {
        if (upToDate) return msg.edit('Already up to date!')

        msg.edit(`${currentAction} Done!`)
        this.update(message, msg, step + 1)
      }
    })
  }
}
