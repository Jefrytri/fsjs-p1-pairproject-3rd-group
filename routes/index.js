const router = require('express').Router()
const authRoutes = require('./auth')
const postRoutes = require('./posts')
const AuthController = require('../controllers/authController')

router.get('/', AuthController.landing)

router.use('/', authRoutes)
router.use('/posts', postRoutes)

module.exports = router