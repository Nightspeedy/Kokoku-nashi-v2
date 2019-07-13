const express = require('express')
const eassry = require('eassry')
const fs = require('fs')
const path = require('path')

const ProfileTemplate = fs.readFileSync(path.resolve('./profile/index.html'), 'utf8')

const app = express()

app.use('/profile', express.static('profile'))

app.get('/profile/card', (req, res) => {
  console.time(`[Profile Card] Generated in`)
  const query = JSON.parse(Buffer.from(decodeURIComponent(req.query.data), 'base64').toString('utf8'))

  query.levelProgress = Math.round((query.currentXP / query.nextXP) * 100)

  console.log(`[Profile Card] Generating for "${query.name}"`)
  console.log(`[Profile Card] Data: `, query)
  try { res.send(eassry(ProfileTemplate, query)) } catch (e) {
    console.time(`[Profile Card]`, e)
    return res.send('Something went wrong')
  }
  console.timeEnd(`[Profile Card] Generated in`)
})

app.listen(8080)
