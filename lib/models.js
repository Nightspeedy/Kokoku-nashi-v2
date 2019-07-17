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
  title: { type: String, default: 'Very title' },
  description: { type: String, default: 'Much mystery' },
  credits: { type: Number, default: 0 },
  reputation: { type: Number, default: 0 },
  exp: { type: Number, default: 0 },
  isBanned: { type: Boolean, default: false },
  dailyLastUsed: { type: Number, default: 946684800 },
  repLastGiven: { type: Number, default: 946684800 },
  emoji: { type: String, default: '🙂' },
  selectedBackground: { type: String },
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

module.exports.Background = mongoose.model('background', {
  url: { type: String, required: true },
  filters: { type: String, default: 'none' },
  name: { type: String, required: true },
  css: { type: String, default: '' }
})

module.exports.Block = mongoose.model('blocks', {
  publicKey: { type: String, required: true },
  prevHash: { type: String, required: true },
  data: { type: String, required: true },
  hash: { type: String, required: true },
  signature: { type: String, required: true },
  nonce: { type: String, default: '' },
  verified: { type: Boolean, default: false },
  rewardTo: { type: String, default: '' },
  found: { type: Boolean, default: false },
  timestamp: { type: Date }
})

module.exports.Wallet = mongoose.model('wallet-states', {
  publicKey: { type: String, required: true },
  value: { type: Number, default: 0 },
  lastBlock: { type: String }
})

module.exports.WalletKeys = mongoose.model('wallet-keys', {
  privateKey: { type: String, required: true },
  publicKey: { type: String, required: true },
  id: { type: String, required: true }
})
