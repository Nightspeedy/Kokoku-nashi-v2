const mongoose = require('mongoose')

module.exports.Guild = mongoose.model('guilds', {
  id: { type: String, required: true },
  logChannel: { type: String },
  autoRoles: { type: Array, default: [] },
  autoRolesEnabled: { type: Boolean, default: false },
  mustHaveReason: { type: Boolean, default: false },
  enableLogfiles: { type: Boolean, default: false },
  enableLevelupMessages: { type: Boolean, default: true },
  customLevelupChannel: { type: String, default: undefined },
  joinLeaveChannel: { type: String, default: undefined },
  welcomeMessage: { type: String, default: `Welcome {MEMBER} just joined!` },
  enableWelcomeMessage: { type: Boolean, default: false },
  leaveMessage: { type: String, default: `Bye {MEMBER} We're sad to see you go!` },
  enableLeaveMessage: { type: Boolean, default: false },
  banMessage: { type: String, default: `{MEMBER} has experienced the true power of the banhammer!` },
  enableBanMessage: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  PREMIUMembedColor: { type: String }
})

module.exports.Member = mongoose.model('members', {
  id: { type: String, required: true },
  level: { type: Number, default: 0 },
  title: { type: String, default: 'Nobody knows my title :O' },
  description: { type: String, default: 'Nobody knows who i am :O' },
  credits: { type: Number, default: 0 },
  reputation: { type: Number, default: 0 },
  exp: { type: Number, default: 0 },
  isBanned: { type: Boolean, default: false },
  dailyLastUsed: { type: Number, default: 946684800 },
  repLastGiven: { type: Number, default: 946684800 },
  createdAt: { type: Date, default: Date.now() }
})

module.exports.Permission = mongoose.model('permissions', {
  guild: { type: String, required: true },
  role: { type: String, required: true },
  granted: { type: String, required: true }
})

module.exports.AutoRoles = mongoose.model('autoroles', {
  guild: { type: String, required: true },
  role: { type: String, required: true }
})
