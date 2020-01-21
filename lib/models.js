const mongoose = require('mongoose')

module.exports.Guild = mongoose.model('guilds', {
  id: { type: String, required: true },
  logChannel: { type: String, default: '' },
  autoRoles: { type: Array, default: [] },
  autoRolesEnabled: { type: Boolean, default: false },
  mustHaveReason: { type: Boolean, default: false },
  enableLogfiles: { type: Boolean, default: false },
  enableLevelupMessages: { type: Boolean, default: true },
  customLevelupChannel: { type: String, default: undefined },
  joinLeaveChannel: { type: String, default: undefined },
  welcomeMessage: { type: String, default: 'Welcome {MEMBER} just joined!' },
  enableWelcomeMessage: { type: Boolean, default: false },
  leaveMessage: { type: String, default: 'Bye {MEMBER} We\'re sad to see you go!' },
  enableLeaveMessage: { type: Boolean, default: false },
  banMessage: { type: String, default: '{MEMBER} has experienced the true power of the banhammer!' },
  enableBanMessage: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false }
})

module.exports.Counting = mongoose.model('counting', {
  id: { type: String, required: true },
  countingEnabled: { type: Boolean, default: false },
  countingNumber: { type: Number, default: 1 },
  countingLast: { type: String, default: '' },
  countingDescription: { type: String, default: 'k!counting. Next message must start with {NUMBER}' },
  countingDoubleMessage: { type: String, default: "You can't post two messages in a row!" },
  countingWrongNumber: { type: String, default: 'The next number must start with {NUMBER} and can not be lower or higher!' }
})

module.exports.Eula = mongoose.model('eula', {
  id: { type: String, required: true },
  accepted: { type: Boolean, default: false }
})

module.exports.Member = mongoose.model('members', {
  id: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
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
  selectedBackground: { type: String, default: 'DISCORD_LIGHT' },
  createdAt: { type: Date, default: Date.now() }
})

module.exports.Subscriptions = mongoose.model('subscription', {
  member: { type: String, required: true },
  guild: { type: String, required: true },
  type: { type: String, required: true },
  active: { type: Boolean, default: true },
  permanent: { type: Boolean, default: false },
  autoRenew: { type: Boolean, default: true },
  renewType: { type: String, default: 'monthly' },
  price: { type: Number, default: 0 },
  activationDate: { type: Date },
  subsriptionLevel: { type: Number, default: 1 }
})

module.exports.Inventory = mongoose.model('inventory', {
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true }
})

module.exports.Steamkeys = mongoose.model('steamkeys', {
  type: { type: String, default: 'game' },
  name: { type: String, required: true },
  key: { type: String, required: true }
})

module.exports.Guides = mongoose.model('guides', {
  name: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String }
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
  css: { type: String, default: '' },
  hidden: { type: Boolean, default: false },
  category: { type: String, default: 'UNCATEGORIZED' },
  preview: { type: String }
})

module.exports.BackgroundCategories = mongoose.model('background-categories', {
  key: { type: String, required: true },
  cost: { type: Number, default: 0 }
})

module.exports.Gifs = mongoose.model('gifs', {
  gifType: { type: String, required: true },
  url: { type: String, required: true }
})

module.exports.Strings = mongoose.model('strings', {
  key: { type: String, unique: true, required: true },
  value: { type: String, required: true }
})

module.exports.Queue = mongoose.model('queue', {
  id: { type: String, unique: true, required: true },
  textChannel: { type: String, required: true },
  voiceChannel: { type: String, required: true },
  currentSong: {
    type: Object,
    default: {
      title: { type: String, required: true },
      url: { type: String, required: true }
    }
  },
  songs: { type: Array, default: [] },
  volume: { type: Number, default: 1 },
  isPlaying: { type: Boolean, default: false },
  paused: { type: Boolean, default: false }
})

module.exports.Wallet = mongoose.model('orbt-wallet-states', {
  publicKey: { type: String, required: true },
  value: { type: Number, default: 0 },
  lastBlock: { type: String }
})

module.exports.WalletKeys = mongoose.model('wallet-keys', {
  privateKey: { type: String, required: true },
  publicKey: { type: String, required: true },
  id: { type: String, required: true }
})

module.exports.CommandLogs = mongoose.model('command-logs', {
  user: { type: String, required: true },
  username: { type: String, required: true },
  command: { type: String, required: true },
  arguments: { type: Array, required: false },
  timestamp: { type: Number, default: Date.now() }
})

module.exports.Cooldown = mongoose.model('cooldown', {
  key: { type: String, required: true },
  time: { type: Date, required: true }
})

module.exports.TimedAction = mongoose.model('timed-actions', {
  type: { type: String, required: true },
  action: { type: Object, required: true },
  shard: { type: Number, default: 0 },
  time: { type: Date, required: true }
})

module.exports.DisabledCommand = mongoose.model('disabled-commands', {
  guild: { type: String, required: true },
  command: { type: String, required: true }
})
