require('dotenv').config()
const express = require('express')
const app = express()
const routes = require('./routes')
const session = require('express-session')

const port = 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(
  session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: true
    }
  })
)

app.use((req, res, next) => {
  res.locals.userId = req.session.userId
  res.locals.username = req.session.username
  res.locals.role = req.session.role
  next()
})

app.use(routes)

app.listen(port, () => {
  console.log(`Listening to http://localhost:${port}`)
})