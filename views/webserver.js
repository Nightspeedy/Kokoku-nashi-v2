const express = require('express')
const eassry = require('eassry')
const fs = require('fs')
const path = require('path')

const ProfileTemplate = fs.readFileSync(path.resolve('views/profile/index.html'), 'utf8')
const LevelUpTemplate = fs.readFileSync(path.resolve('views/level-up/index.html'), 'utf8')

const app = express()

app.use('/profile', express.static('views/profile'))
app.use('/level-up', express.static('views/level-up'))

app.get('/profile/card', (req, res) => {
  const query = JSON.parse(Buffer.from(decodeURIComponent(req.query.data), 'base64').toString('utf8'))

  query.title = query.title.replace(/[&<>]/g, '')
  query.description = query.description.replace(/[&<>]/g, '')
  query.name = query.name.replace(/[&<>]/g, '')

  query.levelProgress = Math.round((query.currentXP / query.nextXP) * 100)

  console.log(`[Profile Card] Generating for "${query.name}"`)
  console.log('[Profile Card] Data: ', query)
  try { res.send(eassry(ProfileTemplate, query)) } catch (e) {
    console.log('[Profile Card]', e)
    return res.send('Something went wrong')
  }
})

app.get('/level-up/card', (req, res) => {
  const query = JSON.parse(Buffer.from(decodeURIComponent(req.query.data), 'base64').toString('utf8'))

  console.log(`[Level Up] Generating for "${query.name}"`)
  console.log('[Level Up] Data: ', query)
  try { res.send(eassry(LevelUpTemplate, query)) } catch (e) {
    console.log('[Level Up]', e)
    return res.send('Something went wrong')
  }
})

app.listen(8080)
