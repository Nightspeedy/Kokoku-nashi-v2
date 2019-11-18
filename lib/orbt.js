const { WalletKeys, Wallet } = require('./models')
const RSA = require('node-rsa')
const io = require('socket.io-client')
const crypto = require('crypto')
const Util = require('util')
const randomBytes = Util.promisify(crypto.randomBytes)

module.exports = class ORBTConnection {
  constructor (bot) {
    this.io = io('https://mine.kokoku.xyz/')
    this.connected = false
    this.io.on('connect', () => {
      console.log('ORBT Connected')
      this.connected = true
    })
    this.io.on('disconnect', () => {
      console.log('ORBT Disconnected')
      this.connected = false
    })
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

  embeds (amount, name) {
    return {
      queued: {
        title: 'Transaction Queued.',
        color: 0xE5A932,
        description: 'Your transaction has been queued. It may take up to 30 seconds to process it.',
        footer: { text: `${amount} to ${name}` },
        timestamp: new Date(Date.now())
      },
      canceled: {
        title: 'Transaction Canceled',
        color: 0xD7422D,
        description: 'You\'ve canceled the transaction.',
        footer: { text: `${amount} to ${name}` },
        timestamp: new Date(Date.now())
      },
      completed: {
        title: 'Transaction Completed',
        color: 0x32E554,
        description: 'Your transaction has been completed.',
        footer: { text: `${amount} to ${name}` },
        timestamp: new Date(Date.now())
      }
    }
  }

  async transfer (from, to, amount, id) {
    if (!this.connected) throw new Error('Connection lost to ORBT Sever.')

    const tranactionID = id || (await randomBytes(32)).toString('hex')

    let fromWalletKeys = typeof (from) === 'object' ? from : await WalletKeys.findOne({ id: from })
    if (!fromWalletKeys) fromWalletKeys = await WalletKeys.create({ ...(await this.newKeyPair()), id: from })

    let toWalletKeys = typeof (to) === 'object' ? to : await WalletKeys.findOne({ id: to })
    if (!toWalletKeys) toWalletKeys = await WalletKeys.create({ ...(await this.newKeyPair()), id: to })
    console.log(fromWalletKeys) 
    console.log('=========================================================================')
    console.log(toWalletKeys)

    let fromWallet = await Wallet.findOne({ publicKey: fromWalletKeys.publicKey })
    if (!fromWallet) fromWallet = await Wallet.create({ publicKey: fromWalletKeys.publicKey })

    if (amount.frac) amount = fromWallet.value / amount.frac

    if (fromWallet.amount < amount) throw new Error('Insufficient funds.')

    let toWallet = await Wallet.findOne({ publicKey: toWalletKeys.publicKey })
    if (!toWallet) toWallet = await Wallet.create({ publicKey: toWalletKeys.publicKey })

    const key = new RSA({ b: 512 })
    key.importKey(fromWalletKeys.publicKey, 'public')
    key.importKey(fromWalletKeys.privateKey, 'pkcs8')

    const rawTransaction = `SEND ${amount} FROM ${fromWalletKeys.publicKey} TO ${toWalletKeys.publicKey}`
    const tranaction = `${rawTransaction} ${key.sign(rawTransaction, 'hex', 'utf8')}`

    this.io.emit('newBlock', { block: tranaction, id: tranactionID })

    return { block: tranaction, id: tranactionID, fromWallet, toWallet }
  }
}
