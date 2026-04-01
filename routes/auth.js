const router = require('express').Router()
const AuthController = require('../controllers/authController')

router.get('/register', AuthController.showRegister)
router.post('/register', AuthController.register)

router.get('/login', AuthController.showLogin)
router.post('/login', AuthController.login)

router.get('/logout', AuthController.logout)

module.exports = router