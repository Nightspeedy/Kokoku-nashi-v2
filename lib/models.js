const mongoose = require('mongoose')

module.exports.Guild = mongoose.model('guilds', {
  id: { type: Number, required: true },
  logChannel: { type: String },
  mustHaveReason: { type: Boolean, default: false},
  enableLogfiles: { type: Boolean, default: false },
  welcomeMessage: { type: String, default: `Welcome {MEMBER} just joined!` },
  enableWelcomeMessage: { type: Boolean, default: false },
  leaveMessage: { type: String, default: `Bye {MEMBER} We're sad to see you go!` },
  enableLeaveMessage: { type: Boolean, default: false },
  banMessage: { type: String, default: `{MEMBER} has experienced the true power of the banhammer!` },
  enableBanMessage: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false }
})

module.exports.Member = mongoose.model('members', {
  id: { type: Number, required: true },
  level: { type: Number, default: 0 },
  credits: { type: Number, default: 0 },
  reputation: { type: Number, default: 0 },
  exp: { type: Number, default: 0 },
  isBanned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now() }
})

module.exports.Permission = mongoose.model('permissions', {
  guild: { type: Number, required: true },
  role: { type: Number, required: true },
  granted: { type: Object, required: true }
})
