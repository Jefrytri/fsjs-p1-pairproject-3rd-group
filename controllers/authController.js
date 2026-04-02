const { User, Profile } = require('../models')
const { comparePassword } = require('../helpers/bcrypt')
const { sendWelcomeEmail } = require('../helpers/nodemailer')

class AuthController {
  static landing(req, res) {
    res.render('landing')
  }

  static showRegister(req, res) {
    const { error } = req.query
    res.render('register', { error })
  }

  static async register(req, res, next) {
  try {
    const { username, email, password, status, avatarUrl } = req.body

    const user = await User.create({
      username,
      email,
      password,
      role: 'user'
    })

    await Profile.create({
      status,
      avatarUrl,
      userId: user.id
    })

    try {
      await sendWelcomeEmail(user.email, user.username)
    } catch (emailError) {
      console.log('Email skipped:', emailError.message)
    }

    res.redirect('/login?success=Register success, please login')
  } catch (error) {

 
    let errors = []

    if (error.name === "SequelizeValidationError") {
      errors = error.errors.map(el => el.message)
    } else {
      errors = [error.message]
    }

    res.redirect(`/register?error=${errors.join(',')}`)
  }
}

  static showLogin(req, res) {
    const { error, success } = req.query
    res.render('login', { error, success })
  }

  static async login(req, res, next) {
  try {
    const { email, password } = req.body

    const user = await User.findOne({
      where: { email }
    })

    if (!user) {
      throw new Error('Invalid email or password')
    }

    const isValid = comparePassword(password, user.password)

    if (!isValid) {
      throw new Error('Invalid email or password')
    }

    req.session.userId = user.id
    req.session.username = user.username || user.email
    req.session.role = user.role

    res.redirect('/posts')
  } catch (error) {

    let errors = []

    if (error.name === "SequelizeValidationError") {
      errors = error.errors.map(el => el.message)
    } else {
      errors = [error.message]
    }

    res.redirect(`/login?error=${errors.join(',')}`)
  }
}

  static logout(req, res) {
    req.session.destroy(() => {
      res.redirect('/login?success=Logout success')
    })
  }
}

module.exports = AuthController