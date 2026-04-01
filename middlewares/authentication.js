function authentication(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login?error=Please login first')
  }

  next()
}

module.exports = authentication