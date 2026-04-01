const nodemailer = require('nodemailer')

async function sendWelcomeEmail(toEmail, username) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Welcome to Hacktivgram',
    html: `<h2>Hello, ${username || 'User'}!</h2>
           <p>Your account has been created 🎉</p>`
  })
}

module.exports = { sendWelcomeEmail }