const { Cooldown } = require('@lib/models')

module.exports = class CooldownHandler {
  async push (time, key) {
    await Cooldown.create({
      time: Date.now() + time,
      key
    })
  }

  async get (key) {
    const cooldown = await Cooldown.findOne({ key })
    if (cooldown && cooldown.time < Date.now()) {
      await cooldown.remove()
      return undefined
    }
    return cooldown
  }
}
