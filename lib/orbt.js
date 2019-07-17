const { WalletKeys, Wallet } = require('./models')
const RSA = require('node-rsa')
const io = require('socket.io-client')
module.exports = class ORBTConnection {
  constructor (bot) {
    this.io = io(`localhost:1882`)
    this.connected = false
    this.io.on('connect', () => { this.connected = true })
    this.io.on('disconnect', () => { this.connected = false })
  }

  async newKeyPair () {
    const key = new RSA({ b: 512 })
    const publicKey = key.exportKey('public').split('-----BEGIN PUBLIC KEY-----')[1].split('-----END PUBLIC KEY-----')[0].split('\n').join('')
    const privateKey = key.exportKey('pkcs8').split('-----BEGIN PRIVATE KEY-----')[1].split('-----END PRIVATE KEY-----')[0].split('\n').join('')

    return { publicKey, privateKey }
  }

  async wallet (id) {
    let walletKeys = await WalletKeys.findOne({ id })
    if (!walletKeys) walletKeys = await WalletKeys.create({ ...(await this.newKeyPair()), id })

    let wallet = await Wallet.findOne({ publicKey: walletKeys.publicKey })
    if (!wallet) wallet = await Wallet.create({ publicKey: walletKeys.publicKey })

    return wallet
  }

  async transfer (from, to, amount) {
    let fromWalletKeys = await WalletKeys.findOne({ id: from })
    if (!fromWalletKeys) fromWalletKeys = await WalletKeys.create({ ...(await this.newKeyPair()), id: from })

    let toWalletKeys = await WalletKeys.findOne({ id: to })
    if (!toWalletKeys) toWalletKeys = await WalletKeys.create({ ...(await this.newKeyPair()), id: to })

    let fromWallet = await Wallet.findOne({ publicKey: fromWalletKeys.publicKey })
    if (!fromWallet) fromWallet = await Wallet.create({ publicKey: fromWalletKeys.publicKey })

    if (fromWallet.amount < amount) throw new Error('Insufficient funds.')

    let toWallet = await Wallet.findOne({ publicKey: toWalletKeys.publicKey })
    if (!toWallet) toWallet = await Wallet.create({ publicKey: toWalletKeys.publicKey })

    const key = new RSA({ b: 512 })
    key.importKey(fromWalletKeys.publicKey, 'public')
    key.importKey(fromWalletKeys.privateKey, 'pkcs8')

    let rawTransaction = `SEND ${amount} FROM ${fromWalletKeys.publicKey} TO ${toWalletKeys.publicKey}`
    let tranaction = `${rawTransaction} ${key.sign(rawTransaction, 'hex', 'utf8')}`

    this.io.emit('newBlock', { block: tranaction })
  }
}
