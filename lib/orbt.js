const { WalletKeys, Wallet } = require('./models')
const RSA = require('node-rsa')
const io = require('socket.io-client')
const crypto = require('crypto')
const Util = require('util')
const EventEmitter = require('events').EventEmitter

const randomBytes = Util.promisify(crypto.randomBytes)

module.exports = class ORBTConnection {
  constructor (bot) {
    this.io = io('https://mine.kokoku.xyz')
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
        description: amount < 100 ?
          'Your transaction has been queued. As it is a low-value transaction; it will be processed when other users make more transactions.' :
          'Your transaction has been queued and will be processed when possible.',
        footer: { text: `${amount} to ${name}` },
        timestamp: new Date(Date.now())
      },
      processing: {
        title: 'Transaction Processing.',
        color: 0x3A6AE9,
        description: 'Your transaction is currently being processed.',
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

    let fromWalletKeys = typeof (from) === 'object' ? from : await WalletKeys.findOne({ id: from })
    if (!fromWalletKeys) fromWalletKeys = await WalletKeys.create({ ...(await this.newKeyPair()), id: from })

    let toWalletKeys = typeof (to) === 'object' ? to : await WalletKeys.findOne({ id: to })
    if (!toWalletKeys) toWalletKeys = await WalletKeys.create({ ...(await this.newKeyPair()), id: to })

    let fromWallet = await Wallet.findOne({ publicKey: fromWalletKeys.publicKey })
    if (!fromWallet) fromWallet = await Wallet.create({ publicKey: fromWalletKeys.publicKey })

    if (amount.frac) amount = fromWallet.value / amount.frac

    if (fromWallet.amount < amount) throw new Error('Insufficient funds.')

    let toWallet = await Wallet.findOne({ publicKey: toWalletKeys.publicKey })
    if (!toWallet) toWallet = await Wallet.create({ publicKey: toWalletKeys.publicKey })

    const key = new RSA({ b: 512 })
    key.importKey(fromWalletKeys.publicKey, 'public')
    key.importKey(fromWalletKeys.privateKey, 'pkcs8')

    const rawTransaction = `${Date.now()}-${fromWalletKeys.publicKey}-${toWalletKeys.publicKey}-${amount}`
    const transaction = `${rawTransaction} ${key.sign(rawTransaction, 'hex', 'utf8')}`

    const status = new EventEmitter()

    const processingListener = data => {
      if (data === transaction) {
        this.io.off('processing', processingListener)
        status.emit('processing')
      }
    }

    const completedListener = data => {
      if (data === transaction) {
        this.io.off('completed', completedListener)
        status.emit('success')
      }
    }

    this.io.on('processing', processingListener)
    this.io.on('completed', completedListener)
    setTimeout(() => this.io.emit('transaction', transaction), 500)

    return { transaction, fromWallet, toWallet, amount, status }
  }
}
